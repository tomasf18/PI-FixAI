# Deploy
## Merge dev branch into main so the images are created
## Change the tag in the target yaml files (statefulset/deployment)
```yaml
containers:
  - name: database-cassandra
    image: ghcr.io/pi-2024-2025-nap/backend-cassandra:<NEWTAG>
```
## Send the updated manifest to the master node into the right folder
```bash
scp <statefulset/deployment.yaml> nap@10.0.23.12:~/pi2025-cluster/k3s/cassandra
kubectl apply -f <statefulset/deployment.yaml>
```

# Create your enviroment of kubernetes (tested on ubuntu vms)
## Inside every node vm
### Disable swap - Necessary to the kubelet full functionality
```bash
sudo swapoff -a
```
#### Comment the swap line on /etc/fstab like this:
```bash
sudo nano /etc/fstab
```
```
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/vda2 during curtin installation
/dev/disk/by-uuid/9d5ae67c-2f5a-4f91-8004-0724cf2fd01c / ext4 defaults 0 1
#/swap.img      none    swap    sw      0       0
```

### Install Dependencies
#### Install curl
```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
```

#### Install containerd - not necessary in k3s
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y containerd.io
```
#### Configure containerd - not necessary in k3s
```bash
sudo mkdir -p /etc/containerd
sudo containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd
sudo systemctl enable containerd
```

#### Add Kubernetes Repository - not necessary in k3s
```bash
sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.32/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.32/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list # you can change the version of kubernetes here
sudo apt-get update
```

### Install kubernetes tools - not necessary in k3s
```bash
sudo apt install -y kubeadm=1.32.3-1.1 kubelet=1.32.3-1.1 kubectl=1.32.3-1.1 kubernetes-cni
sudo apt-mark hold kubeadm kubelet kubectl
sudo systemctl enable kubelet
```

### Enable Ipv4 Forwarding - Ubuntu doesnt allow by default
```bash
sudo sysctl -w net.ipv4.ip_forward=1
```
#### Persist it
```bash
sudo nano /etc/sysctl.conf
```
#### Add or uncomment the following line: 
```
net.ipv4.ip_forward = 1
```
#### Apply changes
```bash
sudo sysctl -p
```

## On the master node
### Build the kubernetes cluster

#### K3S
```bash
curl -sfL https://get.k3s.io | sh -
```
##### Get the Join token
```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

##### Get the master's ip
```bash
hostname -I
```
##### Now, in the worker node, enter in the cluster
```bash
curl -sfL https://get.k3s.io | K3S_URL=https://MASTER_IP:6443 K3S_TOKEN=NODE_TOKEN sh -
```

##### In the master make the alias to use kubectl
```bash
nano ~/.bashrc
```
```bash
alias kubectl='sudo k3s kubectl'
```
```bash
source ~/.bashrc 
```

#### K8s
```bash
sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --cri-socket=unix:///var/run/containerd/containerd.sock
```

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

##### Install the container networking solution for the cluster
```bash
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```
##### See if master is ready
```bash
kubectl get nodes
```
##### Get the join command
```bash
kubeadm token create --print-join-command
```

##### Then, in the worker nodes, do the command to join the cluster shown in the previously output with sudo behind
```bash
sudo kubeadm join ... 
```

# Utils if something happens wrong - K8S
## Clean Node
```bash
sudo kubeadm reset -f
sudo systemctl stop kubelet
sudo systemctl stop containerd 

# Optional: remove CNI configs
sudo rm -rf /etc/cni /var/lib/cni /var/lib/kubelet /etc/kubernetes

# Restart container runtime
sudo systemctl start containerd 
```

# In simple cluster case, remove the tain for the master node
```bash
kubectl taint nodes master node-role.kubernetes.io/control-plane:NoSchedule-
```

# Make master "clean" as dont run pods
```bash
kubectl taint nodes master node-role.kubernetes.io/master:NoSchedule
```

# Configure ssh in the vms
## Install openssh server
```bash
sudo apt install -y openssh-server
```

## Start the service
```bash
sudo systemctl enable ssh
sudo systemctl start ssh
```
## Now in your pc access both machines
```bash
ssh user-name@vm-ip
```
## In your pc copy the public key to the vms (Optional)
```bash
ssh-copy-id user-name@vm-ip
```

# Kubernetes Pod Setup
## Send the necessary yaml configuration to the master node
```bash
scp -r k8s/ user-name@vm-ip:~/
```
## Save the docker image in .tar | You need to have previously ran the docker-compose
```bash
docker save -o deploy-backend.tar deploy-backend
docker save -o deploy-database-cassandra.tar deploy-database-cassandra 
docker save -o deploy-database-minio.tar deploy-database-minio
docker save -o deploy-llm-consumer-description.tar deploy-llm-consumer-description
docker save -o deploy-llm-consumer-clustering.tar deploy-llm-consumer-clustering
```
## Send the image to all nodes
```bash
scp deploy-backend.tar deploy-database-cassandra.tar deploy-database-minio.tar deploy-llm-consumer-description.tar deploy-llm-consumer-clustering.tar user-name@vm-ip:~/
```
## Import docker image to k3s containerd - K3S
```bash
sudo k3s ctr -n k8s.io images import ~/deploy-backend.tar
sudo k3s ctr -n k8s.io images import ~/deploy-database-cassandra.tar
sudo k3s ctr -n k8s.io images import ~/deploy-database-minio.tar
sudo k3s ctr -n k8s.io images import ~/deploy-llm-consumer-description.tar
sudo k3s ctr -n k8s.io images import ~/deploy-llm-consumer-clustering.tar
```

## Import docker image to containerd - K8S
```bash
sudo ctr -n k8s.io images import ~/deploy-backend.tar
sudo ctr -n k8s.io images import ~/deploy-database-cassandra.tar
sudo ctr -n k8s.io images import ~/deploy-database-minio.tar
sudo ctr -n k8s.io images import ~/deploy-llm-consumer-description.tar
sudo ctr -n k8s.io images import ~/deploy-llm-consumer-clustering.tar
```
## Install nginx-ingress in the master node - not necessary in k3s because it already has traefik
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/baremetal/deploy.yaml
```

## Setup Persistent Volumes
### You'll need to have an NFS(network file share) server on the master node so the volume can be shared between nodes
```bash
sudo apt install nfs-kernel-server -y
```
Go to the `nfs_server.md`

### You also need to have the nfs client in all the nodes
```bash
sudo apt install nfs-common -y
```

## Configure Ingress in k3s
### If you want http:
```yaml
metadata:
    annotations:
        traefik.ingress.kubernetes.io/router.entrypoints: web
spec:
  ingressClassName: traefik
  rules:
  - http:
      paths:
      - path: /api/v1
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8000
```
### If you want https:
#### Create the secret from the keys
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout private.key.pem -out domain.cert.pem -subj "/CN=your-domain.com"
```
#### Or send the certs/ to the master
```bash
scp -r certs/ user@vm-ip:~/
ssh user@vm-ip
cd certs/
```
#### Create a tls-secret into the cluster
```bash
kubectl create secret tls tls-secret --cert=domain.cert.pem --key=private.key.pem -n default
```

```yaml
metadata:
    annotations:
        traefik.ingress.kubernetes.io/router.entrypoints: websecure
spec:
  ingressClassName: traefik
  tls:
    - hosts:
      - your-domain.com
    - secretName: tls-secret
  rules:
    - host: your-domain.com
      http:
        paths:
        - path: /api/v1
          pathType: Prefix
          backend:
            service:
              name: backend-service
              port:
                number: 8000
```

## When updating the app-config do this command
### Fetch the config (Necessary)
```bash
kubectl get configmap app-config -n default -o yaml > app-config.yaml
```
### Update it
```bash
nano app-config.yaml
```
### Apply it
```bash
kubectl apply -f app-config.yaml -n default
```
### If you need to copy to much variables, send the app-config.yaml to the vm and delete the current cluster's configmap
```bash
scp app-config.yaml user@vm-ip:~/pi2025-cluster/k3s
cd pi2025-cluster/k3s
kubectl delete configmap app-config
kubectl apply -f app-config.yaml
```

# After restart the computer/VM's
## On the master node
```bash
sudo crictl rm -f $(sudo crictl ps -aq)
sudo crictl rmp -f $(sudo crictl pods -q)
sudo systemctl restart kubelet
```

## Check if cassandra has the wrong ips as peers
```bash
kubectl get pods -o wide
kubectl exec -it database-cassandra-statefulset-0 -- cqlsh -e "SELECT peer, host_id FROM system.peers;"

kubectl exec -it database-cassandra-statefulset-0 -- /bin/bash # check if is there an ip that don't exist 
nodetool removenode <node-id>
```

# Add h3 organizations

## Copy h3-index folder
```bash
scp -r h3-index/ master@<master-ip>:~/
```

## Expose cassandra port by its service changing type and adding a port
```yaml
apiVersion: v1
kind: Service
metadata:
  name: database-cassandra
spec:
  selector:
    app: database-cassandra-pod
  ports:
    - protocol: TCP
      port: 9042   
      targetPort: 9042  
      nodePort: 32092
  type: NodePort 
```

## Copy and configure .h3.env
```bash
AUTH_KEYSPACE=auth
H3_INDEX_KEYSPACE=h3_index
APP_DATA_KEYSPACE=app_data
CASSANDRA_CONTAINER_PORT=32092
CASSANDRA_HOST=<master-ip>

scp .h3.env master@<master-ip>:~/h3-index
ssh master@<master-ip>
cd h3-index
cp .h3.env .env
sudo rm -rf .h3.env
```

## Change the add-organizationX.py
```py
CASSANDRA_NODES = [os.getenv('CASSANDRA_HOST')] 
```

## Run
```bash
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 add-organizationX.py
```

## Requisites for the VMs to deploy
You need to have a secret to login to the docker registry to pull images:
```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<YOUR_GH_USER> \
  --docker-password=<YOUR_PAT> \
  --docker-email=<YOUR_EMAIL>
```
And you have to have the reference in the `.yaml` manifests:
```yaml
spec:
  imagePullSecrets:
    - name: ghcr-secret
  containers:
    - name: myapp
      image: ghcr.io/<YOUR_ORG>/myapp:1.2.3
      imagePullPolicy: IfNotPresent
```


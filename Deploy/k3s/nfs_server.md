# Setting Up Dynamic NFS Provisioning for Kubernetes

This guide explains how to configure an NFS server on a machine (IP: 192.168.124.1, network: 192.168.124.0/24) for dynamic provisioning in Kubernetes, deploy the NFS Subdir External Provisioner, and create storage classes for Minio, Zookeeper, Cassandra, and Kafka. It also includes corrected configurations for a Cassandra StatefulSet and Service to form a multi-node cluster.

## Prerequisites
- Ubuntu-based machine with NFS server capabilities.
- Kubernetes cluster with `kubectl` configured.
- Network access between the NFS server (192.168.124.1) and Kubernetes nodes (192.168.124.0/24).

## Step 1: Configure NFS Server
1. **Install NFS Server:**
   ```bash
   sudo apt update
   sudo apt install nfs-kernel-server -y
   ```

2. **Create NFS Directory:**
   - Create a single directory for dynamic provisioning:
     ```bash
     sudo mkdir -p /mnt/nfs
     sudo chown nobody:nogroup /mnt/nfs
     sudo chmod 777 /mnt/nfs
     ```

3. **Configure NFS Exports:**
   - Edit `/etc/exports` to export `/mnt/nfs`:
     ```bash
     echo "/mnt/nfs 192.168.124.0/24(rw,sync,no_subtree_check,no_root_squash)" | sudo tee -a /etc/exports
     ```

4. **Apply and Restart NFS:**
   ```bash
   sudo exportfs -a
   sudo systemctl restart nfs-kernel-server
   sudo systemctl enable nfs-kernel-server
   ```

## Step 2: Deploy NFS Subdir External Provisioner
The provisioner automates subdirectory creation on the NFS server for each PVC.

1. **Clone Repository:**
   ```bash
   sudo apt install git -y
   git clone https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner.git
   cd nfs-subdir-external-provisioner/deploy
   ```

2. **Configure RBAC:**
   ```bash
   kubectl apply -f rbac.yaml
   ```

3. **Edit Deployment:**
   - Modify `deployment.yaml` to set:
     - namespace: kube-system
     - `NFS_SERVER: 192.168.124.1` <- Master's ip
     - `NFS_PATH: /mnt/nfs`
   - Example:
     ```yaml
     env:
       - name: NFS_SERVER
         value: "192.168.124.1"
       - name: NFS_PATH
         value: "/mnt/nfs"
     ```

4. **Deploy Provisioner:**
   ```bash
   kubectl apply -f deployment.yaml
   ```

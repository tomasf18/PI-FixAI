#!/usr/bin/env bash
set -euo pipefail

# deploy-images.sh
# Usage: deploy-images.sh --nodes <node1> [node2 ...] [--dest-folder <remote-folder>] <image1.tar> [image2.tar ...]
# Copies each .tar to the specified folder on each node, then imports it into k3s's containerd
# and tags it so k3s can see it via <imagename>:latest.
# Requires SSH connectivity (passwordless or sshpass-enabled) to each node.

function usage() {
  cat <<EOF
Usage: $0 --nodes <node1> [node2 ...] [--dest-folder <folder>] <image1.tar> [image2.tar ...]

Example:
  $0 --nodes nap@10.0.23.12 nap@10.0.23.32 deploy-backend.tar deploy-database-cassandra.tar

Options:
  --nodes        Space-separated list of SSH targets (user@host or host) where images will be deployed
  --dest-folder  (Optional) Remote directory under each node to copy images into (default: ~/pi2025-cluster/docker-images)
EOF
  exit 1
}

# Parse arguments
if [[ $# -lt 3 ]]; then
  usage
fi

# Defaults
DEST_FOLDER="~/pi2025-cluster/docker-images"

declare -a NODES=()
declare -a TARS=()

# Read --nodes
if [[ "$1" != "--nodes" ]]; then
  usage
fi
shift
while [[ $# -gt 0 && "$1" != "--dest-folder" && ! "$1" == *.tar ]]; do
  NODES+=("$1")
  shift
done

# Optional --dest-folder
if [[ $# -gt 0 && "$1" == "--dest-folder" ]]; then
  shift
  if [[ $# -gt 0 ]]; then
    DEST_FOLDER="$1"
    shift
  else
    echo "❌ --dest-folder requires an argument"
    exit 2
  fi
fi

# Remaining args are .tar files
if [[ $# -eq 0 ]]; then
  echo "❌ No .tar files specified"
  usage
fi
TARS=("$@")

# Deploy each tar to each node
for node in "${NODES[@]}"; do
  echo "===> Deploying to $node (dest: $DEST_FOLDER)"
  for tar in "${TARS[@]}"; do
    [[ -f "$tar" ]] || { echo "❌ File not found: $tar"; exit 3; }
    img=$(basename "$tar" .tar)

    echo "  • Copying $tar to $node:$DEST_FOLDER/"
    scp "$tar" "$node:$DEST_FOLDER/"

    echo "  • Importing $img on $node"
    ssh "$node" bash -c "'
      sudo k3s ctr -n k8s.io images import $DEST_FOLDER/$(basename \"$tar\")
    '"

    echo "  ✅ $img deployed on $node"
  done
  echo
done

echo "✅ All images deployed successfully to all nodes."

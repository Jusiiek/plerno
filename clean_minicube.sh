#!/bin/bash

echo "Deleting all Kubernetes pods and services..."

kubectl delete pods --all
kubectl delete deployments --all
kubectl delete services --all

echo "Deleted all pods and services."

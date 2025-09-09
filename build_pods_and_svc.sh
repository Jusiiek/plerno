#!/bin/bash
set -e
cd k8n
echo "Creating Minikube sources..."

# MongoDB
kubectl apply -f mongo-deployment.yaml
kubectl apply -f mongo-service.yaml

# Auth Service
kubectl apply -f auth-app-deployment.yaml
kubectl apply -f auth-app-service.yaml

# Plerno API
kubectl apply -f plerno-api-deployment.yaml
kubectl apply -f plerno-api-service.yaml

# Web App
kubectl apply -f web-deployment.yaml
kubectl apply -f web-service.yaml

echo "Created all pods and services!"
kubectl get pods -o wide
kubectl get svc -o wide

#!/bin/bash
set -e

echo "===== 1. User Service (Python) ====="
cd auth-app
echo "Building Docker image: auth-app:1.0"
docker build -t auth-app:1.0 .

cd ..

echo "===== 2. Backend (Spring Boot) ====="
cd Plerno
echo "Maven build..."
./mvnw clean package -DskipTests

echo "Building Docker image: plerno-api:1.0"
docker build -t plerno-api:1.0 .

cd ..

echo "===== 3. Frontend (Angular) ====="
cd web
echo "Installing dependencies..."
npm install

echo "Building Angular app..."
ng build

echo "Building Docker image: web-app:1.0"
docker build -t web-app:1.0 .

cd ..

echo "===== All images built successfully ====="
docker images | grep -E "plerno-backend|user-service|web-app"

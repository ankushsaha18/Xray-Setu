#!/bin/bash

# Xray-Setu Deployment Script
# This script helps deploy the application to various platforms

set -e  # Exit on any error

echo "Xray-Setu Deployment Script"
echo "=========================="

# Function to display usage
usage() {
    echo "Usage: $0 [local|render|aws|gcp|azure]"
    echo "  local   - Deploy locally using Docker Compose"
    echo "  render  - Instructions for Render deployment"
    echo "  aws     - Instructions for AWS deployment"
    echo "  gcp     - Instructions for Google Cloud Platform deployment"
    echo "  azure   - Instructions for Azure deployment"
    exit 1
}

# Check if argument is provided
if [ $# -eq 0 ]; then
    usage
fi

# Get deployment target
TARGET=$1

# Function to deploy locally
deploy_local() {
    echo "Deploying locally using Docker Compose..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo "Error: Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        echo "Error: Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Build and start services
    echo "Building and starting services..."
    docker-compose up -d --build
    
    echo "Deployment complete!"
    echo "Access the application at http://localhost"
    echo "To stop the services, run: docker-compose down"
}

# Function to show Render deployment instructions
deploy_render() {
    echo "Deploying to Render:"
    echo "1. Fork this repository to your GitHub account"
    echo "2. Create a Render account at https://render.com"
    echo "3. Connect your GitHub account to Render"
    echo "4. Create a new Web Service and select your forked repository"
    echo "5. Use the provided render.yaml configuration file"
    echo "6. Add environment variables through the Render dashboard:"
    echo "   - SECRET_KEY: Generate a secure secret key"
    echo "   - DEBUG: Set to False for production"
    echo "7. Add a PostgreSQL database through Render's dashboard"
    echo "8. Update the DATABASE_URL environment variable with the connection string provided by Render"
    echo "9. Deploy the application"
    echo ""
    echo "For detailed instructions, see DOCKER_DEPLOYMENT.md"
}

# Function to show AWS deployment instructions
deploy_aws() {
    echo "Deploying to AWS:"
    echo "Option 1: Using EC2"
    echo "1. Launch an EC2 instance with Ubuntu Server"
    echo "2. Configure security groups to allow HTTP (port 80) and HTTPS (port 443)"
    echo "3. SSH into your instance and install Docker:"
    echo "   sudo apt update"
    echo "   sudo apt install docker.io docker-compose -y"
    echo "   sudo usermod -aG docker ubuntu"
    echo "4. Clone your repository:"
    echo "   git clone <repository-url>"
    echo "   cd Xray-Setu"
    echo "5. Start the services:"
    echo "   docker-compose up -d --build"
    echo ""
    echo "Option 2: Using ECS"
    echo "1. Create an ECS cluster"
    echo "2. Create task definitions for each service"
    echo "3. Set up load balancers and security groups"
    echo "4. Deploy services using AWS CLI or Console"
    echo ""
    echo "For detailed instructions, see DOCKER_DEPLOYMENT.md"
}

# Function to show GCP deployment instructions
deploy_gcp() {
    echo "Deploying to Google Cloud Platform:"
    echo "1. Create a Compute Engine instance"
    echo "2. Install Docker and Docker Compose:"
    echo "   sudo apt update"
    echo "   sudo apt install docker.io docker-compose -y"
    echo "   sudo usermod -aG docker \$USER"
    echo "3. Clone your repository and deploy:"
    echo "   git clone <repository-url>"
    echo "   cd Xray-Setu"
    echo "   docker-compose up -d --build"
    echo ""
    echo "For detailed instructions, see DOCKER_DEPLOYMENT.md"
}

# Function to show Azure deployment instructions
deploy_azure() {
    echo "Deploying to Azure:"
    echo "1. Create a Virtual Machine with Ubuntu"
    echo "2. Install Docker and Docker Compose:"
    echo "   sudo apt update"
    echo "   sudo apt install docker.io docker-compose -y"
    echo "   sudo usermod -aG docker \$USER"
    echo "3. Clone your repository and deploy:"
    echo "   git clone <repository-url>"
    echo "   cd Xray-Setu"
    echo "   docker-compose up -d --build"
    echo ""
    echo "For detailed instructions, see DOCKER_DEPLOYMENT.md"
}

# Main deployment logic
case $TARGET in
    local)
        deploy_local
        ;;
    render)
        deploy_render
        ;;
    aws)
        deploy_aws
        ;;
    gcp)
        deploy_gcp
        ;;
    azure)
        deploy_azure
        ;;
    *)
        echo "Error: Invalid deployment target '$TARGET'"
        usage
        ;;
esac
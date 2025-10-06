# Docker Deployment Guide

This guide provides instructions for deploying the Xray-Setu application using Docker Compose locally and publicly.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Deployment](#local-deployment)
- [Public Deployment](#public-deployment)
  - [Deploy to Render](#deploy-to-render)
  - [Deploy to AWS](#deploy-to-aws)
  - [Deploy to Google Cloud Platform](#deploy-to-google-cloud-platform)
  - [Deploy to Azure](#deploy-to-azure)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 1.29+ installed
- Git (for cloning the repository)
- At least 4GB RAM available

## Local Deployment

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Xray-Setu
   ```

2. Build and start the services:
   ```bash
   docker-compose up -d --build
   ```

3. Access the application at `http://localhost`

4. To stop the services:
   ```bash
   docker-compose down
   ```

## Public Deployment

### Deploy to Render

Render offers a simple way to deploy multi-container applications directly from your GitHub repository.

1. Create a Render account at [render.com](https://render.com)

2. Fork this repository to your GitHub account

3. Connect your GitHub account to Render

4. Create a new Web Service and select your forked repository

5. Configure the service with the following settings:
   - Build Command: `docker-compose build`
   - Start Command: `docker-compose up -d`
   - Environment Variables:
     - `SECRET_KEY`: Generate a secure secret key
     - `DEBUG`: Set to `False` for production

6. Add a PostgreSQL database through Render's dashboard

7. Update the `DATABASE_URL` environment variable with the connection string provided by Render

8. Deploy the application

### Deploy to AWS

#### Option 1: Using EC2

1. Launch an EC2 instance with Ubuntu Server
2. Configure security groups to allow HTTP (port 80) and HTTPS (port 443)
3. SSH into your instance and install Docker:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker ubuntu
   ```
4. Clone your repository:
   ```bash
   git clone <repository-url>
   cd Xray-Setu
   ```
5. Start the services:
   ```bash
   docker-compose up -d --build
   ```

#### Option 2: Using ECS (Elastic Container Service)

1. Create an ECS cluster
2. Create task definitions for each service
3. Set up load balancers and security groups
4. Deploy services using AWS CLI or Console

### Deploy to Google Cloud Platform

1. Create a Compute Engine instance
2. Install Docker and Docker Compose:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker $USER
   ```
3. Clone your repository and deploy:
   ```bash
   git clone <repository-url>
   cd Xray-Setu
   docker-compose up -d --build
   ```

### Deploy to Azure

1. Create a Virtual Machine with Ubuntu
2. Install Docker and Docker Compose:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker $USER
   ```
3. Clone your repository and deploy:
   ```bash
   git clone <repository-url>
   cd Xray-Setu
   docker-compose up -d --build
   ```

## Environment Variables

The application uses several environment variables that should be configured for production:

- `SECRET_KEY`: Django secret key (required, should be a random secret)
- `DEBUG`: Set to `False` for production (default: True)
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_API_URL`: URL for the backend API (default: http://localhost:8000)

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.

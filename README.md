# Xray-Setu: AI-Powered Medical Imaging Diagnosis Platform

Xray-Setu is an innovative medical imaging diagnosis platform that leverages cutting-edge artificial intelligence to analyze X-ray images and provide preliminary diagnostic insights. Our solution aims to bridge the gap in healthcare accessibility by offering rapid, accurate preliminary diagnoses, particularly in underserved regions where radiologists are scarce.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Docker Deployment](#docker-deployment)
- [Public Deployment](#public-deployment)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Features

- AI-powered X-ray image analysis using deep learning models
- User authentication and role-based access control
- Secure image upload and storage
- Detailed diagnostic reports with confidence scores
- Responsive web interface for healthcare professionals
- RESTful API for integration with existing systems

## Tech Stack

### Frontend
- Next.js 14 (React framework)
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons

### Backend
- Django 5.2 (Python web framework)
- Django REST Framework
- PostgreSQL database
- Gunicorn as WSGI server
- TensorFlow 2.19 for AI model inference

### DevOps
- Docker & Docker Compose for containerization
- Nginx as reverse proxy
- Render/AWS/GCP/Azure for deployment

## Prerequisites

- Node.js 18+
- Python 3.10+
- Docker Engine 20.10+
- Docker Compose 1.29+
- Git

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Xray-Setu
   ```

2. Install frontend dependencies:
   ```bash
   cd xraysetu
   npm install
   cd ..
   ```

3. Set up the backend:
   ```bash
   cd backend/core
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   cd ../..
   ```

4. Start the frontend:
   ```bash
   cd xraysetu
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Docker Deployment

For production deployment, we recommend using Docker Compose:

1. Build and start all services:
   ```bash
   docker-compose up -d --build
   ```

2. Access the application at `http://localhost`

3. To stop the services:
   ```bash
   docker-compose down
   ```

For detailed Docker deployment instructions, see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)

## Public Deployment

To deploy the application publicly, you have several options:

### Deploy to Render (Recommended for simplicity)

1. Fork this repository to your GitHub account
2. Create a Render account at [render.com](https://render.com)
3. Connect your GitHub account to Render
4. Create a new Web Service and select your forked repository
5. Use the provided `render.yaml` configuration file
6. Add environment variables through the Render dashboard
7. Deploy the application

### Deploy to AWS

1. Launch an EC2 instance with Docker installed
2. Clone your repository
3. Run `docker-compose up -d --build`

### Deploy to Google Cloud Platform

1. Create a Compute Engine instance
2. Install Docker and Docker Compose
3. Deploy using `docker-compose up -d --build`

### Deploy to Azure

1. Create a Virtual Machine with Ubuntu
2. Install Docker and Docker Compose
3. Deploy using `docker-compose up -d --build`

For detailed public deployment instructions, see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)

## API Documentation

API documentation is available at `/api/docs/` when the backend server is running.

## Screenshots

![Screenshot 1](Screenshot%202025-09-24%20at%2012.20.22%E2%80%AFAM.png)
![Screenshot 2](Screenshot%202025-09-24%20at%2012.20.32%E2%80%AFAM.png)
![Screenshot 3](Screenshot%202025-09-24%20at%2012.20.56%E2%80%AFAM.png)
![Screenshot 4](Screenshot%202025-09-24%20at%2012.21.15%E2%80%AFAM.png)
![Screenshot 5](Screenshot%202025-09-24%20at%2012.21.36%E2%80%AFAM.png)
![Screenshot 6](Screenshot%202025-09-24%20at%2012.21.47%E2%80%AFAM.png)
![Screenshot 7](Screenshot%202025-09-24%20at%2012.22.17%E2%80%AFAM.png)
![Screenshot 8](Screenshot%202025-09-24%20at%2012.22.40%E2%80%AFAM.png)
![Screenshot 9](Screenshot%202025-09-24%20at%2012.24.48%E2%80%AFAM.png)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
# Xray Setu Documentation Overview

This document provides an overview of all documentation files available in the Xray Setu project.

## Available Documentation Files

### 1. [README.md](README.md)
**Main project documentation**
- Project overview and features
- Tech stack information
- Setup instructions for local development
- Deployment instructions
- Team information

### 2. [DEPLOYMENT.md](DEPLOYMENT.md)
**Detailed deployment guide**
- Deployment options (Render recommended)
- Step-by-step deployment instructions
- Environment variable configuration
- Troubleshooting common deployment issues

### 3. [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md)
**Specialized Render deployment guide**
- Render-specific deployment instructions
- Database setup on Render
- Service configuration
- Environment variable setup
- Troubleshooting Render-specific issues

### 4. [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
**Comprehensive troubleshooting guide**
- Common issues and solutions
- Debugging steps
- Error message explanations
- Emergency fixes

## Deployment Configuration Files

### [render.yaml](render.yaml)
- Render service configuration file
- Defines both backend and frontend services
- Automatic deployment configuration

### [backend/core/Procfile](backend/core/Procfile)
- Backend startup command for hosting platforms

### [xraysetu/Procfile](xraysetu/Procfile)
- Frontend startup command for hosting platforms

### [start.sh](start.sh)
- Main start script for the monorepo

## Additional Files

### [LICENSE](LICENSE)
- MIT License information

### [requirements.txt](backend/core/requirements.txt)
- Python dependencies for the backend

### [package.json](xraysetu/package.json)
- Node.js dependencies for the frontend

## Getting Started

For new developers or deployers, we recommend reading the documentation in this order:

1. [README.md](README.md) - Overall project understanding
2. [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment concepts
3. [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) - Render-specific deployment
4. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solutions for common issues

## Support

If you need additional help with the documentation or have questions about the project, please:

1. Check all documentation files for relevant information
2. Review the source code for implementation details
3. Create an issue in the repository if you find a problem or need clarification
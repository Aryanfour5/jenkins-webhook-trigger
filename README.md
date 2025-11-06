# 🌦️ Weather Monitor - Jenkins GitHub Webhook CI/CD

> Automated weather information web application with GitHub webhook-triggered Jenkins CI/CD pipeline and Docker containerization.

[![GitHub](https://img.shields.io/badge/GitHub-jenkins--webhook--trigger-blue?logo=github)](https://github.com/Aryanfour5/jenkins-webhook-trigger)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://www.python.org/)
[![Jenkins](https://img.shields.io/badge/Jenkins-Automated-red?logo=jenkins)](https://www.jenkins.io/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Access the Application](#access-the-application)
- [Jenkinsfile Explanation](#jenkinsfile-explanation)
- [Dockerfile Explanation](#dockerfile-explanation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

**Weather Monitor** is a fully automated CI/CD demonstration project that showcases:

- ✅ **Static HTML web application** with multi-page weather information (Pune & Mumbai)
- ✅ **GitHub webhook integration** that automatically triggers builds on every commit
- ✅ **Jenkins pipeline** with 5-stage automated deployment process
- ✅ **Docker containerization** with Python HTTP server for lightweight deployment
- ✅ **ngrok tunneling** to expose local Jenkins to the internet
- ✅ **Zero manual intervention** - from commit to live in ~15 seconds

**Use Case:** Learn how to set up production-ready CI/CD pipelines with GitHub webhooks, Jenkins automation, and Docker containerization.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Auto-Trigger** | Automatically starts build on GitHub push (webhook) |
| 🏗️ **5-Stage Pipeline** | Cleanup → Checkout → Build → Run → Health Check |
| 🐳 **Docker Ready** | Containerized app with Python 3.11 HTTP server |
| 🌐 **Multi-Page App** | Home, Pune Weather, Mumbai Weather pages |
| 💅 **Beautiful UI** | Responsive design with gradient backgrounds |
| 📊 **Real-Time Updates** | JavaScript updates displayed time automatically |
| 🔐 **Secure** | Uses GitHub credentials and API tokens |
| ⚡ **Fast Deployment** | Complete pipeline executes in 15-18 seconds |

---

## 🏗️ Architecture

```
DEVELOPER
    ↓
git commit → git push
    ↓
GITHUB REPOSITORY
    ↓
GitHub Webhook Trigger
    ↓
ngrok Tunnel
    ↓
JENKINS SERVER (Port 8080)
    ├─ Stage 1: Force Cleanup
    ├─ Stage 2: Checkout Code
    ├─ Stage 3: Build Docker Image
    ├─ Stage 4: Run Container (Port 8888)
    └─ Stage 5: Health Check
    ↓
DOCKER CONTAINER (Port 3000 → 8888)
    ├─ Python 3.11 HTTP Server
    ├─ Static Files (HTML/CSS/JS)
    └─ Health Check Enabled
    ↓
YOUR APPLICATION
http://localhost:8888 ✅ LIVE
```

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5 - Page structure
- CSS3 - Responsive design with gradients
- Vanilla JavaScript - Navigation & interactions
- Font Awesome - Weather icons

**Backend/Server:**
- Python 3.11 - Built-in HTTP server
- Lightweight, no external dependencies

**DevOps/CI-CD:**
- Jenkins - Automation server
- GitHub - Version control & webhooks
- Docker - Container runtime
- ngrok - Local tunnel exposure
- Git - Version control

**Infrastructure:**
- Docker - Containerization
- Port Mapping - 8888:3000
- Health Checks - Container verification

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✓ Git installed
- ✓ Docker installed (latest version)
- ✓ Jenkins installed locally (Java 11+)
- ✓ GitHub account with repository
- ✓ ngrok installed (https://ngrok.com)
- ✓ Python 3.11+ (for local testing)
- ✓ Terminal/PowerShell access

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/Aryanfour5/jenkins-webhook-trigger.git
cd jenkins-webhook-trigger
```

### 2. Start ngrok Tunnel

```bash
ngrok http 8080
```

Note the URL: `https://xxx.ngrok.io`

### 3. Configure Jenkins

**Install Plugins:**
- GitHub plugin
- Pipeline plugin
- Git plugin

**Configure GitHub Server:**
- Manage Jenkins → Configure System
- Add GitHub server with Personal Access Token

### 4. Create Jenkins Job

- New Item → Pipeline
- Name: `jenkins-newhook-web`
- Enable: "GitHub hook trigger for GITScm polling"
- Pipeline: SCM (Git)
- Repository: `https://github.com/Aryanfour5/jenkins-webhook-trigger.git`
- Branch: `*/main`

### 5. Configure GitHub Webhook

- Repository → Settings → Webhooks
- Payload URL: `https://YOUR_NGROK_URL/github-webhook/`
- Content type: `application/json`
- Events: Pushes
- Active: ✓ Checked

### 6. Test It

```bash
echo "# Test" >> README.md
git add README.md
git commit -m "Trigger webhook test"
git push origin main
```

✅ **Automatic build starts in Jenkins!**

---

## 📁 Project Structure

```
jenkins-webhook-trigger/
│
├── .gitignore              # Exclude node_modules
├── .dockerignore           # Docker build config
├── Jenkinsfile             # CI/CD pipeline definition
├── README.md               # This file
│
└── weather-monitor/        # Main application
    │
    ├── Dockerfile          # Python 3.11 HTTP server
    ├── package.json        # Project metadata
    │
    └── public/             # Static files served
        │
        ├── index.html      # Home page
        ├── pune.html       # Pune weather
        ├── mumbai.html     # Mumbai weather
        │
        ├── css/
        │   └── styles.css  # Beautiful responsive CSS
        │
        └── js/
            └── script.js   # Navigation & interactions
```

---

## 🔄 How It Works

### Step 1: You Push Code
```bash
git push origin main
```

### Step 2: GitHub Detects Push
- Webhook configured in repository settings
- Sends HTTP POST to ngrok URL

### Step 3: Webhook Reaches Jenkins
- ngrok forwards request to Jenkins:8080
- Jenkins automatically triggers pipeline

### Step 4: 5-Stage Pipeline Executes

**Stage 1: Force Cleanup** (1-2 sec)
```bash
docker ps -a | grep weather-monitor | xargs -r docker rm -f
# Removes old containers, frees port 8888
```

**Stage 2: Checkout** (2-3 sec)
```groovy
checkout scm
# Pulls latest code from GitHub
```

**Stage 3: Build Docker Image** (3-5 sec)
```bash
docker build -t weather-monitor:${BUILD_NUMBER} .
# Creates image from Dockerfile
```

**Stage 4: Run Container** (1-2 sec)
```bash
docker run -d -p 8888:3000 --name weather-monitor-${BUILD_NUMBER} weather-monitor:${BUILD_NUMBER}
# Starts container, maps port 8888→3000
```

**Stage 5: Health Check** (1-2 sec)
```bash
curl -s http://localhost:8888/
# Verifies app is running
```

### Step 5: Application Live ✅
- App available at `http://localhost:8888`
- All pages functional and responsive

---

## 🌐 Access the Application

### From Your Browser

| URL | Page |
|-----|------|
| `http://localhost:8888/` | Home - City selection |
| `http://localhost:8888/pune.html` | Pune weather details |
| `http://localhost:8888/mumbai.html` | Mumbai weather details |

### Features on Each Page

**Home Page:**
- City selection cards with weather icons
- Links to weather pages
- Project information

**Pune Page:**
- Temperature: 28°C
- Humidity: 65%, Wind: 12 km/h
- City coordinates and info
- Navigation to other pages

**Mumbai Page:**
- Temperature: 32°C
- Humidity: 72%, Wind: 18 km/h
- City coordinates and info
- Navigation to other pages

---

## 📝 Jenkinsfile Explanation

### Pipeline Definition

```groovy
pipeline {
    agent any              // Run on any available agent
    
    triggers {
        githubPush()       // Auto-trigger on GitHub push
    }
    
    stages {
        // Stage 1, 2, 3, 4, 5...
    }
}
```

### Key Commands

| Command | Purpose |
|---------|---------|
| `docker ps -a` | List all containers |
| `docker rm -f` | Force remove containers |
| `docker build` | Create Docker image |
| `docker run` | Start container |
| `curl` | Test HTTP endpoint |

---

## 🐳 Dockerfile Explanation

### Base Image
```dockerfile
FROM python:3.11-slim
```
- Lightweight Python image
- Slim = only essential packages

### File Copy
```dockerfile
COPY public/ /app/
```
- Copies your static files to container
- Makes them available to HTTP server

### Server Start
```dockerfile
CMD ["python", "-m", "http.server", "3000"]
```
- Starts built-in Python HTTP server
- Listens on port 3000
- Serves files from `/app/` directory

### Port Mapping
```dockerfile
EXPOSE 3000
```
- Documents the port (internal)
- External: 8888 (in Jenkinsfile)

---

## 🐛 Troubleshooting

### Port 8888 Already in Use

**Solution:** Kill existing containers
```bash
docker ps -a | grep weather-monitor
docker rm -f <container_id>
```

Or use different port in Jenkinsfile:
```bash
docker run -d -p 8889:3000 ...
# Access on http://localhost:8889
```

### Jenkins Not Receiving Webhook

**Check:**
1. ngrok tunnel is running: `ngrok http 8080`
2. GitHub webhook delivery: Settings → Webhooks → Recent Deliveries
3. Jenkins "GitHub hook trigger" is enabled on job
4. Payload URL is correct

### Docker Build Fails

**Check:**
```bash
# Verify files exist
ls -la weather-monitor/public/
ls -la weather-monitor/Dockerfile

# Test build manually
cd weather-monitor
docker build -t test .
```

### Application Not Responding

**Check:**
```bash
# Verify container is running
docker ps | grep weather-monitor

# Check logs
docker logs <container_id>

# Test endpoint
curl http://localhost:8888/
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Aryan**

- GitHub: [@Aryanfour5](https://github.com/Aryanfour5)
- Project Link: [jenkins-webhook-trigger](https://github.com/Aryanfour5/jenkins-webhook-trigger)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you learn CI/CD!

---

**Built with ❤️ using Jenkins, Docker, and GitHub Webhooks**

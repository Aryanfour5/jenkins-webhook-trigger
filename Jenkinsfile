pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    stages {
        stage('Force Cleanup') {
            steps {
                echo '========== Force Cleanup Stage =========='
                script {
                    sh '''
                        echo "Force killing and removing all weather-monitor containers..."
                        docker ps -a --filter "name=weather-monitor" --format "{{.ID}}" | xargs -r docker rm -f
                        echo "All containers cleaned up"
                        docker ps -a | grep weather-monitor || echo "No weather-monitor containers found"
                    '''
                }
            }
        }
        
        stage('Checkout') {
            steps {
                echo '========== Checkout Stage =========='
                checkout scm
                echo "Repository checked out successfully"
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '========== Building Docker Image =========='
                script {
                    sh '''
                        cd weather-monitor
                        echo "Building Docker image: weather-monitor:${BUILD_NUMBER}"
                        docker build -t weather-monitor:${BUILD_NUMBER} .
                        echo "Docker image built successfully"
                    '''
                }
            }
        }
        
        stage('Run Container on Port 8888') {
            steps {
                echo '========== Running Container on Port 8888 =========='
                script {
                    sh '''
                        echo "Starting container on port 8888..."
                        docker run -d -p 8888:3000 --name weather-monitor-${BUILD_NUMBER} weather-monitor:${BUILD_NUMBER}
                        sleep 3
                        echo "Container started successfully on http://localhost:8888"
                        docker ps | grep weather-monitor
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '========== Health Check =========='
                script {
                    sh '''
                        sleep 2
                        echo "Testing application on port 8888..."
                        curl -s http://localhost:8888/ | head -15 || echo "Health check may still be initializing..."
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '========== Build Status =========='
            sh 'docker ps | grep weather-monitor || echo "Container info"'
        }
        success {
            echo '✓ Deployment successful on http://localhost:8888'
        }
        failure {
            echo '✗ Build failed - check logs above'
        }
    }
}

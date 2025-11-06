pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    stages {
        stage('Cleanup Old Containers') {
            steps {
                echo '========== Cleanup Stage =========='
                script {
                    sh '''
                        echo "Stopping and removing old containers..."
                        docker ps -a | grep weather-monitor && docker stop $(docker ps -a -q -f "name=weather-monitor") || true
                        docker ps -a | grep weather-monitor && docker rm $(docker ps -a -q -f "name=weather-monitor") || true
                        echo "Cleanup completed"
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
        
        stage('Run Container') {
            steps {
                echo '========== Running Container =========='
                script {
                    sh '''
                        echo "Starting container on port 3000..."
                        docker run -d -p 3000:3000 --name weather-monitor-${BUILD_NUMBER} weather-monitor:${BUILD_NUMBER}
                        sleep 3
                        echo "Container started successfully"
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
                        echo "Testing application endpoint..."
                        curl -s http://localhost:3000/ | head -20 || echo "Health check in progress..."
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '========== Build Status =========='
            sh 'docker ps | grep weather-monitor || echo "No containers running"'
        }
        success {
            echo '✓ Build and deployment successful!'
        }
        failure {
            echo '✗ Build failed - check logs above'
        }
    }
}

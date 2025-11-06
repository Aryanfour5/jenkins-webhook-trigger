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
                        echo "Stopping old containers..."
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
                        docker build -t weather-monitor:${BUILD_NUMBER} .
                        echo "Docker image built: weather-monitor:${BUILD_NUMBER}"
                    '''
                }
            }
        }
        
        stage('Run Container') {
            steps {
                echo '========== Running Container =========='
                script {
                    sh '''
                        docker run -d -p 3000:3000 --name weather-monitor-${BUILD_NUMBER} weather-monitor:${BUILD_NUMBER}
                        sleep 2
                        echo "Container started on port 3000"
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
                        curl -s http://localhost:3000/ | head -10
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '========== Build Completed =========='
        }
        success {
            echo '✓ Deployment successful on port 3000!'
        }
        failure {
            echo '✗ Build failed - check logs'
        }
    }
}

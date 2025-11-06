pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    stages {
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
                        sleep 3
                        echo "Container started"
                        docker ps | grep weather-monitor || echo "Container check failed"
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
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build failed - check logs above'
        }
    }
}

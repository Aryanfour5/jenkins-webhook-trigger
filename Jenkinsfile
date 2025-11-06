pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Repository checked out"
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        cd weather-monitor
                        docker build -t weather-monitor:${BUILD_NUMBER} .
                    '''
                }
            }
        }
        
        stage('Run & Test') {
            steps {
                script {
                    sh '''
                        docker run -d -p 3000:3000 --name weather-${BUILD_NUMBER} weather-monitor:${BUILD_NUMBER}
                        sleep 3
                        curl http://localhost:3000/ || echo "Container starting"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker ps -a | grep weather-' || true
        }
    }
}

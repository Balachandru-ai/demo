pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "backend-app"
        FRONTEND_IMAGE = "frontend-app"
    }

    stages {

        stage('Cleanup Old Containers') {
            steps {
                sh '''
                    docker rm -f backend-container frontend-container || true
                 '''
            }
        }


        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE -f Dockerfile.backend .'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $FRONTEND_IMAGE -f Dockerfile.frontend .'
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh '''
                docker rm -f backend-container || true
                docker rm -f frontend-container || true
                '''
            }
        }

        stage('Run Backend Container') {
            steps {
                sh 'docker run -d -p 5000:5000 --name backend-container $BACKEND_IMAGE'
            }
        }

        stage('Run Frontend Container') {
            steps {
                sh 'docker run -d -p 80:80 --name frontend-container $FRONTEND_IMAGE'
            }
        }
    }
}

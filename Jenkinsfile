pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "balachandru/webpage"
        DOCKER_TAG = "latest"
    }

    stages {

        stage('Clone Code') {
            steps {
                git 'https://github.com/Balachandru-ai/demo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:$DOCKER_TAG .'
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $DOCKER_IMAGE:$DOCKER_TAG'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop webpage || true
                docker rm webpage || true
                docker run -d -p 80:5000 --name webpage $DOCKER_IMAGE:$DOCKER_TAG
                '''
            }
        }
    }
}

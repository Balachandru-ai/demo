pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "balachandru/backend"
        DOCKER_TAG = "latest"
    }

    stages {

        stage('Build Backend Image') {
            steps {
                sh 'docker build -f Dockerfile.backend -t $DOCKER_IMAGE:$DOCKER_TAG .'
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
                docker stop backend || true
                docker rm backend || true
                docker run -d -p 5000:5000 --name backend $DOCKER_IMAGE:$DOCKER_TAG
                '''
            }
        }
    }
}

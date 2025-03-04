pipeline {
    agent any

    environment {
        IMAGE_NAME = "docker.io/aayanindia/vaultify"
        CONTAINER_PORT = "3033"
        HOST_PORT = "3033"
        DOCKER_HUB_USERNAME = credentials('docker-hub-username')
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password')
        EMAIL_RECIPIENTS = "atul.rajput@aayaninfotech.com"
        SONARTOKEN = credentials('sonartoken')
        AWS_ACCESS_KEY_ID = credentials('aws-access-key')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout scm
                }
            }
        }

        stage('Run ESLint') {
            steps {
                script {
                    sh 'npm run lint || echo "⚠️ ESLint completed with errors, but continuing pipeline..."'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    sh """
                    docker run --rm -v \
                        $(pwd):/usr/src --network host \
                        sonarsource/sonar-scanner-cli:latest \
                        -Dsonar.projectKey=vaultify-back \
                        -Dsonar.sources=/usr/src \
                        -Dsonar.host.url=http://54.236.98.193:9000 \
                        -Dsonar.login=${SONARTOKEN}
                    """
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    sh """
                    echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin
                    """
                }
            }
        }

        stage('Generate Next Image Tag') {
            steps {
                script {
                    def latestTag = sh(script: """
                        curl -s https://hub.docker.com/v2/repositories/aayanindia/handy-frontend/tags/ | \
                        jq -r '.results[].name' | grep -E '^stage-v[0-9]+$' | sort -V | tail -n1 | awk -F'v' '{print $2}'
                    """, returnStdout: true).trim()
                    
                    def newTag = latestTag ? "stage-v${latestTag.toInteger() + 1}" : "stage-v1"
                    env.NEW_STAGE_TAG = newTag
                    echo "🆕 New Docker Image Tag: ${newTag}"
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    sh """
                    docker build -t ${IMAGE_NAME}:latest .
                    docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${NEW_STAGE_TAG}
                    docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:prodv1
                    docker push ${IMAGE_NAME}:${NEW_STAGE_TAG}
                    docker push ${IMAGE_NAME}:prodv1
                    """
                }
            }
        }

        stage('Security Scan with Trivy') {
            steps {
                script {
                    sh """
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image \
                        --exit-code 0 --severity HIGH,CRITICAL ${IMAGE_NAME}:${NEW_STAGE_TAG}
                    """
                }
            }
        }

        stage('Stop Existing Container') {
            steps {
                script {
                    sh """
                    CONTAINER_ID=$(docker ps -q --filter "publish=${HOST_PORT}")
                    if [ -n "$CONTAINER_ID" ]; then
                        docker stop "$CONTAINER_ID" && docker rm "$CONTAINER_ID"
                    fi
                    """
                }
            }
        }

        stage('Run New Docker Container') {
            steps {
                script {
                    sh """
                    docker run -d \
                        -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
                        -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
                        -p ${HOST_PORT}:${CONTAINER_PORT} ${IMAGE_NAME}:prodv1
                    """
                }
            }
        }
    }

    post {
        always {
            emailext (
                subject: "🚀 Pipeline Status: ${currentBuild.currentResult} (Build #${BUILD_NUMBER})",
                body: """
                <html>
                <body>
                <p><strong>Pipeline Status:</strong> ${currentBuild.currentResult}</p>
                <p><strong>Build Number:</strong> ${BUILD_NUMBER}</p>
                <p><strong>Check the <a href='${BUILD_URL}'>console output</a>.</strong></p>
                </body>
                </html>
                """,
                to: "${EMAIL_RECIPIENTS}",
                from: "development.aayanindia@gmail.com",
                mimeType: 'text/html'
            )
        }

        failure {
            emailext (
                subject: "🚨 Deployment Failed (Build #${BUILD_NUMBER})",
                body: """
                <html>
                <body>
                <p><strong>❌ Deployment Failed</strong></p>
                <p><strong>Logs:</strong> Attached below.</p>
                <p><strong>Check the <a href='${BUILD_URL}'>console output</a>.</strong></p>
                </body>
                </html>
                """,
                attachLog: true,
                to: "${EMAIL_RECIPIENTS}",
                from: "development.aayanindia@gmail.com",
                mimeType: 'text/html'
            )
        }
    }
}

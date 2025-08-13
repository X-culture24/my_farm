pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'farm-system'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        REGISTRY = 'your-registry.com'
        NODE_VERSION = '18'
    }
    
    tools {
        nodejs "NodeJS-${NODE_VERSION}"
        docker "Docker"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint & Format Check') {
            steps {
                sh 'npm run lint'
                sh 'npm run format:check'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'npm run test:coverage'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Test Coverage Report'
                    ])
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=moderate'
                sh 'npm run security:scan'
            }
        }
        
        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Run Integration Tests') {
            steps {
                sh 'docker-compose -f docker-compose.test.yml up -d'
                sh 'npm run test:integration'
                sh 'docker-compose -f docker-compose.test.yml down'
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'registry-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                sh 'kubectl apply -f k8s/staging/'
                sh 'kubectl rollout status deployment/farm-system-staging'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?'
                sh 'kubectl apply -f k8s/production/'
                sh 'kubectl rollout status deployment/farm-system-production'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            // Send notification
            emailext (
                subject: "Pipeline Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "Pipeline failed at stage: ${currentBuild.description}",
                to: 'team@farm-system.com'
            )
        }
    }
}

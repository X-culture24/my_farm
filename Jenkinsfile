pipeline {
    agent any
    
    environment {
        BACKEND_IMAGE = 'farm-system-backend'
        FRONTEND_IMAGE = 'farm-system-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        REGISTRY = 'your-registry.com'
        NODE_VERSION = '18'
        SONAR_PROJECT_KEY = 'farm-management-system'
    }
    
    tools {
        nodejs "NodeJS-${NODE_VERSION}"
        docker "Docker"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        sh 'npm ci --silent'
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci --silent'
                        }
                    }
                }
            }
        }
        
        stage('Code Quality') {
            parallel {
                stage('Backend Lint & Format') {
                    steps {
                        sh 'npm run lint'
                        sh 'npm run format:check'
                    }
                }
                stage('Frontend Lint & Format') {
                    steps {
                        dir('frontend') {
                            sh 'npm run lint'
                            sh 'npm run format:check'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        sh 'npm run test:coverage'
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'coverage/junit.xml'
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Backend Test Coverage'
                            ])
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm run test:coverage'
                        }
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'frontend/coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Frontend Test Coverage'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Security & Quality Scans') {
            parallel {
                stage('Security Audit') {
                    steps {
                        sh 'npm audit --audit-level=moderate || true'
                        dir('frontend') {
                            sh 'npm audit --audit-level=moderate || true'
                        }
                    }
                }
                stage('SonarQube Analysis') {
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh '''
                                sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                -Dsonar.sources=src,frontend/src \
                                -Dsonar.tests=src/__tests__,frontend/src/__tests__ \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info,frontend/coverage/lcov.info \
                                -Dsonar.testExecutionReportPaths=coverage/test-report.xml,frontend/coverage/test-report.xml
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Build Applications') {
            parallel {
                stage('Build Backend') {
                    steps {
                        sh 'npm run build'
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            def backendImage = docker.build("${BACKEND_IMAGE}:${DOCKER_TAG}", ".")
                            backendImage.tag("${BACKEND_IMAGE}:${GIT_COMMIT_SHORT}")
                        }
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        script {
                            def frontendImage = docker.build("${FRONTEND_IMAGE}:${DOCKER_TAG}", "./frontend")
                            frontendImage.tag("${FRONTEND_IMAGE}:${GIT_COMMIT_SHORT}")
                        }
                    }
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh '''
                    docker-compose -f docker-compose.test.yml up -d --build
                    sleep 30
                    npm run test:integration || true
                    docker-compose -f docker-compose.test.yml down -v
                '''
            }
        }
        
        stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'registry-credentials') {
                        // Push backend images
                        docker.image("${BACKEND_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${BACKEND_IMAGE}:${GIT_COMMIT_SHORT}").push()
                        
                        // Push frontend images
                        docker.image("${FRONTEND_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${FRONTEND_IMAGE}:${GIT_COMMIT_SHORT}").push()
                        
                        if (env.BRANCH_NAME == 'main') {
                            docker.image("${BACKEND_IMAGE}:${DOCKER_TAG}").push('latest')
                            docker.image("${FRONTEND_IMAGE}:${DOCKER_TAG}").push('latest')
                        }
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    helm upgrade --install farm-system-staging ./helm/farm-system \
                        --namespace staging \
                        --set image.backend.tag=${DOCKER_TAG} \
                        --set image.frontend.tag=${DOCKER_TAG} \
                        --set environment=staging \
                        --wait --timeout=10m
                '''
                sh 'kubectl rollout status deployment/farm-system-backend-staging -n staging'
                sh 'kubectl rollout status deployment/farm-system-frontend-staging -n staging'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    input message: 'Deploy to production?', 
                          parameters: [
                              choice(choices: ['Deploy', 'Abort'], 
                                     description: 'Confirm production deployment', 
                                     name: 'DEPLOY_CHOICE')
                          ]
                }
                sh '''
                    helm upgrade --install farm-system-production ./helm/farm-system \
                        --namespace production \
                        --set image.backend.tag=${DOCKER_TAG} \
                        --set image.frontend.tag=${DOCKER_TAG} \
                        --set environment=production \
                        --wait --timeout=15m
                '''
                sh 'kubectl rollout status deployment/farm-system-backend-production -n production'
                sh 'kubectl rollout status deployment/farm-system-frontend-production -n production'
            }
        }
    }
    
    post {
        always {
            // Archive artifacts
            archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'frontend/build/**/*', allowEmptyArchive: true
            
            // Publish test results
            publishTestResults testResultsPattern: '**/coverage/junit.xml'
            
            // Clean workspace
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: "✅ Farm System deployment successful! Build: ${env.BUILD_NUMBER}, Branch: ${env.BRANCH_NAME}"
            )
        }
        failure {
            echo 'Pipeline failed!'
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: "❌ Farm System deployment failed! Build: ${env.BUILD_NUMBER}, Branch: ${env.BRANCH_NAME}"
            )
            emailext (
                subject: "Pipeline Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: """
                    Pipeline failed at stage: ${currentBuild.description}
                    
                    Build Number: ${env.BUILD_NUMBER}
                    Branch: ${env.BRANCH_NAME}
                    Commit: ${env.GIT_COMMIT_SHORT}
                    
                    Check the build logs: ${env.BUILD_URL}
                """,
                to: 'devops-team@farm-system.com'
            )
        }
        unstable {
            echo 'Pipeline is unstable!'
            slackSend(
                channel: '#deployments',
                color: 'warning',
                message: "⚠️ Farm System deployment unstable! Build: ${env.BUILD_NUMBER}, Branch: ${env.BRANCH_NAME}"
            )
        }
    }
}

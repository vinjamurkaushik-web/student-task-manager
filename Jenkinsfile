pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate') {
            steps {
                bat 'if not exist index.html exit /b 1'
                bat 'if not exist login.html exit /b 1'
                bat 'if not exist signup.html exit /b 1'
                bat 'if not exist profile.html exit /b 1'
                bat 'if not exist style.css exit /b 1'
                bat 'if not exist script.js exit /b 1'
                bat 'if not exist auth.js exit /b 1'
                bat 'if not exist Dockerfile exit /b 1'
                bat 'if not exist .dockerignore exit /b 1'
                bat 'if not exist docker-compose.yml exit /b 1'
                bat 'if not exist tests\\Dockerfile exit /b 1'
                bat 'if not exist tests\\requirements.txt exit /b 1'
                bat 'if not exist tests\\conftest.py exit /b 1'
                bat 'if not exist tests\\test_signup.py exit /b 1'
                bat 'if not exist tests\\test_login.py exit /b 1'
                bat 'if not exist tests\\test_profile.py exit /b 1'
                bat 'if not exist tests\\test_tasks.py exit /b 1'
                echo 'All required project files are present.'
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'index.html,login.html,signup.html,profile.html,style.css,script.js,auth.js,Dockerfile,.dockerignore,docker-compose.yml,tests/**,README.md,Jenkinsfile', fingerprint: true
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker compose build web'
            }
        }

        stage('Selenium Tests') {
            steps {
                bat 'docker compose --profile test up --build --abort-on-container-exit --exit-code-from tests'
            }
        }
    }

    post {
        always {
            bat 'docker compose down'
        }
    }
}

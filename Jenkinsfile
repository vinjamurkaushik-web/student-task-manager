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
                bat 'if not exist style.css exit /b 1'
                bat 'if not exist script.js exit /b 1'
                echo 'All required project files are present.'
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'index.html,style.css,script.js,README.md', fingerprint: true
            }
        }
    }
}
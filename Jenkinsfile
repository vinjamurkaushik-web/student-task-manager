pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Validate Project Files') {
            steps {
                echo 'Validating required project files...'
                script {
                    def requiredFiles = ['index.html', 'style.css', 'script.js', 'README.md']

                    for (fileName in requiredFiles) {
                        if (!fileExists(fileName)) {
                            error("Missing required file: ${fileName}")
                        } else {
                            echo "Found: ${fileName}"
                        }
                    }
                }
                echo 'All required files are present!'
            }
        }

        stage('Build Info') {
            steps {
                echo '========================================='
                echo '  Project  : Student Task Manager'
                echo '  Type     : Static Web Application'
                echo '  Tech     : HTML + CSS + JavaScript'
                echo "  Branch   : ${env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'unknown'}"
                echo "  Build #  : ${env.BUILD_NUMBER}"
                echo '========================================='
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo 'Archiving project files...'
                archiveArtifacts artifacts: '**/*.html, **/*.css, **/*.js, README.md',
                                 fingerprint: true,
                                 allowEmptyArchive: false
                echo 'Artifacts archived successfully!'
            }
        }

    }

    post {
        success {
            echo 'Build PASSED - Student Task Manager is ready!'
        }
        failure {
            echo 'Build FAILED - Check the console output above for details.'
        }
        always {
            echo 'Pipeline finished. Check the Jenkins dashboard for results.'
        }
    }

}

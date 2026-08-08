pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/Aishwarya2007277/jenkins.git'
            }
        }

        stage('Build') {
            steps {
                sh '''
                    echo "Checking project files..."

                    test -f index.html
                    test -f styles.css
                    test -f app.js

                    echo "✅ All required files are present."
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment stage'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }

        failure {
            echo '❌ Pipeline failed. Check the console output.'
        }
    }
}
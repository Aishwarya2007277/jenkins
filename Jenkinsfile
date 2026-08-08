pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building project...'

                sh '''
                    test -f index.html
                    test -f styles.css
                    test -f app.js

                    echo "All project files are present."
                    echo "Build successful!"
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Testing project...'

                sh '''
                    test -s index.html
                    test -s styles.css
                    test -s app.js

                    echo "Tests passed!"
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                echo 'Deployment successful!'
            }
        }
    }

    post {
        success {
            echo 'PIPELINE SUCCESS!'
        }

        failure {
            echo 'PIPELINE FAILED!'
        }
    }
}
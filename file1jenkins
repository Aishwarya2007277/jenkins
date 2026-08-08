Pipeline script:
pipeline {
    agent any

    tools {
        maven 'maven'
        jdk 'java'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'git@github.com:codefeeding99/Testing-and-Builing-using-pipe-line.git',
                    credentialsId: 'pipeline key'
            }
        }

        stage('Build & Test') {
            steps {
                bat 'mvn clean install'
            }
        }

        stage('Deploy (Optional)') {
            steps {
                echo " Deployment stage (add steps if needed)"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Build failed. Check logs above."
        }
    }
}

pipeline {
    agent any

    tools {
        // On utilise NodeJS, il faudra le configurer dans Jenkins sous le nom 'Node18'
        nodejs 'Node20' 
    }

    stages {
        stage('1. Récupération du code') {
            steps {
                checkout scm
            }
        }
        
        stage('2. Backend (Install & Test)') {
            steps {
                dir('backend') {
                    bat 'npm install'
                    bat 'npm test'
                }
            }
        }
        
        stage('3. Frontend (Build)') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
        
        stage('4. Construction des images Docker') {
            steps {
                script {
                    // Construit l'image Docker du backend
                    docker.build("bi-boutique-backend:latest", "./backend")
                    // Construit l'image Docker du frontend
                    docker.build("bi-boutique-frontend:latest", "./frontend")
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Le pipeline a réussi avec succès !'
        }
        failure {
            echo '❌ Le pipeline a échoué.'
        }
    }
}
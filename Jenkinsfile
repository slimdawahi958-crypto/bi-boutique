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
                    // Utilisation du chemin exact trouvé avec la commande 'where docker'
                    bat '"C:\\Users\\slimd\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t bi-boutique-backend:latest ./backend'
                    bat '"C:\\Users\\slimd\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t bi-boutique-frontend:latest ./frontend'
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
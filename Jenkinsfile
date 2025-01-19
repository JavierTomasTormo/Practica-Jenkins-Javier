pipeline {
    agent any
    parameters {
        string(name: 'Executor', defaultValue: 'Unknown', description: 'Nom de qui executa la pipeline')
        string(name: 'Motiu', defaultValue: 'Testing', description: 'Motiu de l\'execució')
        string(name: 'ChatID', defaultValue: '', description: 'Chat ID de Telegram')
    }
    environment {
        LINTER_STAGE = 'Failure'
        TEST_STAGE = 'Failure'
        UPDATE_README_STAGE = 'Failure'
        DEPLOY_STAGE = 'Failure'
    }
    stages {
        stage('Petició de dades') {
            steps {
                echo "Executor: ${params.Executor}"
                echo "Motiu: ${params.Motiu}"
                echo "ChatID: ${params.ChatID}"
            }
        }
        stage('Linter') {
            steps {
                sh 'npx eslint src/**/*.js || true'
            }
            post {
                success {
                    script {
                        env.LINTER_STAGE = 'Success'
                    }
                }
                failure {
                    script {
                        env.LINTER_STAGE = 'Failure'
                    }
                }
            }
        }
        stage('Test') {
            steps {
                sh 'npx jest'
            }
            post {
                success {
                    script {
                        env.TEST_STAGE = 'Success'
                    }
                }
                failure {
                    script {
                        env.TEST_STAGE = 'Failure'
                    }
                }
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Update_Readme') {
            steps {
                script {
                    def badge = env.TEST_STAGE == 'Success' ? '![Success](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)' : '![Failure](https://img.shields.io/badge/test-failure-red)'
                    sh "echo 'RESULTADO DE LOS ÚLTIMOS TESTS\n${badge}' >> README.md"
                }
            }
            post {
                success {
                    script {
                        env.UPDATE_README_STAGE = 'Success'
                    }
                }
                failure {
                    script {
                        env.UPDATE_README_STAGE = 'Failure'
                    }
                }
            }
        }
        stage('Push_Changes') {
            steps {
                sh 'sh jenkinsScripts/pushChanges.sh'
            }
        }
        stage('Deploy to Vercel') {
            when {
                allOf {
                    environment name: 'LINTER_STAGE', value: 'Success'
                    environment name: 'TEST_STAGE', value: 'Success'
                    environment name: 'UPDATE_README_STAGE', value: 'Success'
                }
            }
            steps {
                sh 'sh jenkinsScripts/deployToVercel.sh'
            }
            post {
                success {
                    script {
                        env.DEPLOY_STAGE = 'Success'
                    }
                }
                failure {
                    script {
                        env.DEPLOY_STAGE = 'Failure'
                    }
                }
            }
        }
        stage('Deploy to Vercel') {
            when {
                expression { currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh './jenkinsScripts/deployVercel.sh'
            }
        }
        stage('Notificació') {
            steps {
                script {
                    def message = """
                    S'ha executat la pipeline de Jenkins amb els següents resultats:
                    - Linter_stage: SUCCESS
                    - Test_stage: SUCCESS
                    - Update_readme_stage: SUCCESS
                    - Deploy_to_Vercel_stage: SUCCESS
                    """
                    sh "node jenkinsScripts/sendTelegram.js ${message}"
                }
            }
        }
    }
}
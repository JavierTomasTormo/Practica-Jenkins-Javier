# Documentación: Pipeline de Jenkins para Proyecto React

## Introducción a Jenkins
Jenkins es una herramienta de integración continua y entrega continua (CI/CD) utilizada para automatizar la construcción, prueba y despliegue de aplicaciones. Permite configurar pipelines que automatizan procesos, asegurando calidad y consistencia en los desarrollos.

Este documento describe cómo implementar un pipeline en Jenkins para un proyecto React, incluyendo linting, pruebas, construcción, despliegue y notificaciones automatizadas.

---

## Requisitos Previos
1. Tener instalado Jenkins y configurado en un entorno accesible.
2. Contar con un proyecto React funcional.
3. Instalar las siguientes herramientas y dependencias:
   - ESLint
   - Jest
   - CLI de Vercel
   - Node.js

---

## Pasos para Configurar el Pipeline

### 1. Crear una Nueva Rama
```bash
git checkout -b ci_jenkins
```

---

### 2. Instalar el Plugin Build Monitor View
1. Accede a **Manage Jenkins > Plugin Manager > Available Plugins**.
2. Busca e instala **Build Monitor View**.
3. Crea una vista en la pantalla principal de Jenkins:
   - Haz clic en **New View > Build Monitor View**.
   - Configura para mostrar todos los trabajos disponibles.

---

### 3. Configurar el Archivo `Jenkinsfile`
Crea un archivo `Jenkinsfile` en la raíz del proyecto con la estructura inicial:
```groovy
pipeline {
    agent any
    environment {
        CHAT_ID = ''
        EXECUTOR = ''
        MOTIVE = ''
    }
    parameters {
        string(name: 'EXECUTOR', description: 'Nom de qui executa la pipeline')
        string(name: 'MOTIVE', description: 'Motiu per executar la pipeline')
        string(name: 'CHAT_ID', description: 'ChatID de Telegram')
    }
    stages {
        stage('Petició de dades') {
            steps {
                script {
                    CHAT_ID = params.CHAT_ID
                    EXECUTOR = params.EXECUTOR
                    MOTIVE = params.MOTIVE
                }
            }
        }
        // Otros stages se añaden aquí
    }
}
```

---

### 4. Añadir Stages

#### Stage: Linter
1. Instala ESLint:
   ```bash
   npm install eslint --save-dev
   npx eslint --init
   ```
2. Añade el siguiente código al `Jenkinsfile`:
```groovy
        stage('Linter') {
            steps {
                sh 'npx eslint .'
            }
        }
```

#### Stage: Test
1. Instala Jest y configura los tests:
   ```bash
   npm install jest --save-dev
   ```
2. Añade el stage:
```groovy
        stage('Test') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }
```

#### Stage: Build
1. Añade el stage:
```groovy
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
```

#### Stage: Update_Readme
1. Crea el script `updateReadme.js` en la carpeta `jenkinsScripts`:
```javascript
const fs = require('fs');
const badge = process.argv[2]; // Badge URL
const readmePath = 'README.md';

fs.appendFileSync(
    readmePath,
    `\nRESULTADO DE LOS ÚLTIMOS TESTS:\n![Test Badge](${badge})`
);
```
2. Añade el stage:
```groovy
        stage('Update_Readme') {
            steps {
                script {
                    def badge = currentBuild.result == 'SUCCESS' 
                                ? 'https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg'
                                : 'https://img.shields.io/badge/test-failure-red'
                    sh "node jenkinsScripts/updateReadme.js ${badge}"
                }
            }
        }
```

#### Stage: Push_Changes
1. Crea el script `pushChanges.sh`:
```bash
#!/bin/bash
git add README.md
git commit -m "Pipeline executada per $EXECUTOR. Motiu: $MOTIVE"
git push origin ci_jenkins
```
2. Añade permisos de ejecución:
```bash
chmod +x jenkinsScripts/pushChanges.sh
```
3. Añade el stage:
```groovy
        stage('Push_Changes') {
            steps {
                sh './jenkinsScripts/pushChanges.sh'
            }
        }
```

#### Stage: Deploy to Vercel
1. Configura el CLI de Vercel:
   ```bash
   npm install -g vercel
   vercel login
   ```
2. Crea el script `deployVercel.sh`:
```bash
#!/bin/bash
vercel --prod
```
3. Añade permisos de ejecución:
```bash
chmod +x jenkinsScripts/deployVercel.sh
```
4. Añade el stage:
```groovy
        stage('Deploy to Vercel') {
            when {
                expression { currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh './jenkinsScripts/deployVercel.sh'
            }
        }
```

#### Stage: Notificació
1. Crea el script `sendTelegram.js`:
```javascript
const axios = require('axios');
const chatId = process.env.CHAT_ID;
const message = process.env.MESSAGE;

axios.post(`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage`, {
    chat_id: chatId,
    text: message,
});
```
2. Añade el stage:
```groovy
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
```

---

### 5. Documentación en el README.md
Incluye:
- Introducción teórica a Jenkins.
- Descripción de cada stage configurado.
- Enlaces:
  - [Repositorio GitHub](#)
  - [Despliegue en Vercel](#)

---

### 6. Ejecutar la Pipeline
1. Accede al proyecto en Jenkins.
2. Ejecuta la pipeline configurando los parámetros requeridos.

---

## Resultado Esperado
- Proyecto desplegado correctamente en Vercel.
- Notificaciones enviadas por Telegram.
- README.md actualizado con el resultado de los tests.
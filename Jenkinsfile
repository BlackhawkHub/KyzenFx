node{
    stage('Scm checkout'){
        def gitexec = tool name: 'Default', type: 'git'
        git branch: 'master', credentialsId: 'GH', url: 'https://github.com/invenico-zw/remit-client-ui.git'
            
    }

    stage('Build docker image'){
        sh 'docker-compose build'
    }

    stage('Github Packages Login'){
           sh "cat /var/lib/jenkins/INVENICO_TOKEN.txt | docker login docker.pkg.github.com -u invenico-repo --password-stdin"
    }
    stage('tagging image'){
    sh 'docker tag remit-frontend-client docker.pkg.github.com/invenico-zw/remit-client-ui/remit-frontend-client:v1'
    }
    stage('Push new image'){
        sh 'docker push docker.pkg.github.com/invenico-zw/remit-client-ui/remit-frontend-client:v1'
    }
    /*stage('Pull new image'){
       def dockerRun ='docker pull docker.pkg.github.com/invenico-zw/remit-client-ui/remit-frontend-client:v1'
        sshagent(['remit-1']) {
            sh "ssh -o StrictHostKeyChecking=no -p 9301 venon@62.171.136.41 ${dockerRun}"
        }
    }*/
}
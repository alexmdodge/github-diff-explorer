pipeline {
  agent {
    docker {
      image 'carbon-alpine'
    }
  }
  environment {
      CI = 'true' 
      HOME = '.'
  }
  stages {
    stage('Build') {
      steps {
        sh 'sudo npm install'
      }
    }
    stage('Test') { 
      steps {
        sh 'sudo npm test' 
      }
    }
  }
}
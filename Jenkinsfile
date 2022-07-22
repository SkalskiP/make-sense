// pipeline {
//     agent {
//         docker {
//             image 'node:14-alpine'
//             args '-p 3005:3005'
//             label 'support_ubuntu_docker'
//         }
//     }
//      environment {
//             HOME = '.'
//             CI = 'true'
//         }
//     stages {
//         stage('Build') {
//             steps {
//                 // sh 'npm cache clean --force'
//                 sh 'npm install'
//             }
//         }
   
//         stage('Deliver') {
//                     steps {
//                         sh "chmod +x -R ${env.WORKSPACE}"
//                         sh './jenkins/scripts/deliver.sh'
//                         // input message: 'Finished using the web site? (Click "Proceed" to continue)'
//                         // sh './jenkins/scripts/kill.sh'
//                     }
//                 }

//     }
// }

pipeline {
    // options {
    //     timeout(time: 1, unit: 'HOURS') 
    // }
    agent {
        dockerfile {
            filename "Dockerfile"
            args '-p 3005:3005'
            label "java-docker-slave"
            additionalBuildArgs "-t my-custom-node:latest"
        }
    }
    environment {
        HOME = '.'
        CI = 'true'
    }
    stages {
        stage("Test") {
            steps {
                sh "chmod +x -R ${env.WORKSPACE}"
                sh "docker stop mydocker2"
                sh "docker rm mydocker2"
                sh "docker run -dit -p 3005:3005  --name=mydocker2 --restart=always  my-custom-node "
                script {
                    echo "test"
                }
            }
        }
    }
}
NAME=offline-app

docker rm -f ${NAME}
docker rmi -f ${NAME}
docker build -t ${NAME} .
docker run -it -p 8085:80 --name ${NAME} ${NAME}

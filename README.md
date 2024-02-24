# Seguri_front
Front for service Seguri

## MEP

* Warning .env.local
* `docker build -t siguri_front -f Dockerfile .`
* `docker save siguri_front -o siguri_front.tar`
* `docker stop siguri_front`
* `docker rm siguri_front`
* `docker image rm siguri_front`
* `docker load -i siguri_front.tar`
* `docker run -d --restart=always -p 8085:80 --name siguri_front siguri_front`
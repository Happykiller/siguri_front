start: 
	docker compose up -d

startall: 
	docker compose up --build -d

down:
	docker stop siguri_front

reset: down
	docker rm siguri_front

tar: 
	docker build -t siguri_front -f Dockerfile .
	docker save siguri_front -o siguri_front.tar

install:
	docker stop siguri_front
	docker rm siguri_front
	docker image rm siguri_front
	docker load -i siguri_front.tar
	docker run -d --restart=always -p 8085:80 --name siguri_front siguri_front

help:
	@echo ""
	@echo "~~ Siguri Front Makefile ~~"
	@echo ""
	@echo "\033[33m make start\033[39m    : Démarre le projet"
	@echo "\033[33m make startall\033[39m : Build et démarre le projet"
	@echo "\033[33m make down\033[39m     : Stop le projet"
	@echo "\033[33m make reset\033[39m    : Reset les containers, les volumes, les networks et les données local"
	@echo ""
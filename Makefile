.PHONY: install test lint

install:
	docker-compose run --rm node npm install

test:
	docker-compose run --rm node npm test

lint:
	docker-compose run --rm node npm run lint

build:
	docker build -t admin_front .
run:
	docker rm -f admin_front && docker run -d -it -p 3001:80 admin_front --name=admin_front
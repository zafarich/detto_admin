build:
	docker build -t admin_front .
rm: 
	docker rm -f admin_front
run:
	docker run -d -it -p 3001:80 admin_front --name=admin_front
rebuild: rm run

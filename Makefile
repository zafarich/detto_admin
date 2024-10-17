build:
	docker build -t admin_front .
rm: 
	docker rm -f admin_front
run:
	docker run -d -it -p 3001:80 --name admin_front admin_front
rebuild: rm run


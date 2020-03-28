all: server

clean:
	@rm -rf build/*.o
	@rm -rf mysqldump-server

server: build/main.o build/httpd.o
	gcc -o mysqldump-server $^

build/main.o: src/main.c src/httpd.h
	@mkdir -p build
	gcc -c -o build/main.o src/main.c

build/httpd.o: src/httpd.c src/httpd.h
	@mkdir -p build
	gcc -c -o build/httpd.o src/httpd.c

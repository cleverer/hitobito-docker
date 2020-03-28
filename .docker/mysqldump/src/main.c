#include "httpd.h"
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>

#include <sys/types.h>
#include <sys/wait.h>
#include <signal.h>

int exec_child(char *);
const char * env_or_default(char *, char *);

const char * mysql_root_pwd;
const char * mysql_db;

int main(int c, char **v) {
  mysql_root_pwd = env_or_default("MYSQL_ROOT_PASSWORD", "root");
  mysql_db = env_or_default("MYSQL_DATABASE", "hitobito");
  serve_forever(env_or_default("MYSQLDUMP_PORT", "8080"));
  return 0;
}

void route() {
  ROUTE_START()

  ROUTE_GET("/") {
    printf("HTTP/1.1 200 OK\r\n\r\n");
    printf("Hello! You are using %s", request_header("User-Agent"));
  }

  ROUTE_GET("/ls") {
    printf("HTTP/1.1 200 OK\r\n\r\n");
    system("ls");
  }

  ROUTE_GET("/test") {
    printf("HTTP/1.1 200 OK\r\n\r\n");
    printf("List of request headers:\r\n\r\n");

    header_t *h = request_headers();

    while (h->name) {
      printf("%s: %s\n", h->name, h->value);
      h++;
    }
  }

  ROUTE_GET("/db/dump") {
    char cmd[100];
    sprintf(cmd, "mysqldump -uroot -p%s --databases %s --skip-comments > /dump/dump.sql", mysql_root_pwd, mysql_db);
    int ret = exec_child(cmd);
    if (ret != -1) {
      printf("HTTP/1.1 200 OK\r\n\r\n");
      printf("Exit status: %d\r\n\r\n", ret);
      printf("Success\r\n\r\n");
    } else {
      printf("HTTP/1.1 500 Internal Server Error\r\n\r\n");
      printf("Error\r\n\r\n");
    }
  }

  ROUTE_GET("/db/load") {
    char cmd[100];
    sprintf(cmd, "mysql -uroot -p%s < /dump/dump.sql", mysql_root_pwd);
    int ret = exec_child(cmd);
    if (ret != -1) {
      printf("HTTP/1.1 200 OK\r\n\r\n");
      printf("Exit status: %d\r\n\r\n", ret);
      printf("Success\r\n\r\n");
    } else {
      printf("HTTP/1.1 500 Internal Server Error\r\n\r\n");
      printf("Error\r\n\r\n");
    }
  }

  ROUTE_END()
}

int exec_child(char *command) {
  char *arguments[4] = { "sh", "-c", command, NULL };

  pid_t c_pid, pid;
  int status;
  signal(SIGCHLD, SIG_DFL);
  c_pid = fork();

  if (c_pid == 0){
    /* CHILD */
    execv( "/bin/sh", arguments);
    //only get here if exec failed                                                                                                                                             
    perror("execve failed");
  } else if (c_pid > 0){
    /* PARENT */
    if( (pid = waitpid(c_pid, &status, 0)) < 0){
      perror("wait");
      return -1;
    }
    return status;
  } else {
    perror("fork failed");
    return -1;
  }
   
  return 0;
}

const char * env_or_default(char *variable_name, char *default_value) {
  const char *value = getenv(variable_name);
  return value ? value : default_value;
}

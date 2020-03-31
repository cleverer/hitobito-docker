# Hitobito
[![Cypress Dashboard](https://img.shields.io/badge/cypress-dashboard-brightgreen.svg)](https://dashboard.cypress.io/#/projects/hd1whh/runs)

[_Hitobito_](https://github.com/hitobito/hitobito) is an open source web application to manage complex group hierarchies with members, events and a lot more.
This repository offers a quick way to begin working on Hitobito and its wagons, using _Docker_ and _docker-compose_.

## System Requirements

In order to use this method, you need to have [Docker][docker] and _[docker-compose][doco]_ installed on your computer.
The free _Docker Community Edition (CE)_ works perfectly fine.

[docker]: https://docs.docker.com/install/
[doco]: https://docs.docker.com/compose/install/

## Preparation

First, you need to clone this repository:

```bash
git clone https://github.com/carlobeltrame/hitobito-docker.git \
  && cd hitobito-docker
```

This contains only the Docker instructions.
But you will also need the Hitobito source code.
That's why you need to clone the Hitobito core project and the specific Hitobito wagon you'd like to work on:

```bash
# core project
git clone https://github.com/hitobito/hitobito.git

# wagon project(s)
git clone https://github.com/hitobito/hitobito_generic.git
```

You need to set up at least one wagon project.
The final structure should look something like this:

```bash
$ ls -lh
total 16K
-rw-r--r--  1 user 1.3K Jul 15 10:57 Dockerfile
-rw-r--r--  1 user 1.4K Jul 15 17:43 README.md
-rw-r--r--  1 user  625 Jul 15 17:41 docker-compose.yml
drwxr-xr-x 36 user 1.2K Jul 15 13:56 hitobito
drwxr-xr-x 27 user  864 Jun 11 09:30 hitobito_generic
```

## Running the project with docker-compose

To start the Hitobito application, run the following command in your shell:

```bash
docker-compose up app
```

It will initially take a while to prepare the initial Docker images, to prepare the database and to start the application.
The process will be shorter on subsequent starts.

Once this is done, you can open the app in your browser under http://localhost:3000 and log in with the email address in the output and the password _hito42bito_.

In order to "receive" emails that are sent out by your hitobito instance, you can open mailcatcher under http://localhost:1080.

## Running in RubyMine
In case you want to run this project in RubyMine without locally installing Ruby (everything through the containers), you can find some additional instructions for setting this up [here](RUBYMINE-SETUP.md).

## Debugging the application

The Rails console is your friend.
Run the following command, to open it.

```bash
docker-compose exec app rails c
```

## Specs

The hitobito application has a lot of rspec tests.
To run them all, use the following command:

```bash
docker-compose run --rm test
```

### Test of a specific Wagon

To test a specific wagon, you need to cd to the directory.
But because the `entrypoint` script automatically does a `bundle exec` for you (which is fine most of the time), you need to overwrite the entrypoint to be plain `bash`.

```bash
$ docker-compose run --rm --entrypoint bash test
Starting hitobito_db-test_1 ... done
root@a42b42c42d42:/app/hitobito# rake db:migrate wagon:migrate # if you changed the db schema
root@a42b42c42d42:/app/hitobito# cd ../hitobito_WAGON/
root@a42b42c42d42:/app/hitobito_WAGON# rspec
```

## Installing gems

After installing new gems or fetching a revision from Git that has some new gems installed, you should re-build your containers:
```bash
$ docker-compose build --no-cache
$ docker-compose up app
```

## Seed

If you need to re-seed your db, use the following command:

```
docker-compose run --rm app rake db:seed wagon:seed
```

After that, you might need to reset the root user's password again:
```
echo 'p=Person.first; p.update(password: "password"); "You can now login under http://localhost:3000 as #{p.email} with the password '"'"'password'"'"'"' | \
  docker-compose run --rm -T app rails c
```

## Full-text search

Hitobito relies on Sphinx Search for indexing Persons, Events and Groups.

At first, you need to create the initial index:

```bash
docker-compose run --rm indexer
```

Then you can start the Sphinx server:

```bash
docker-compose up sphinx
```

The server does not automatically re-index.
In order to re-index, run the indexer again.

## Clean up / Reset

Once you've made your changes and decide to stop working on the project, you should clean up. The following command will remove all data that was created by Docker and _docker-compose_.

```bash
docker-compose down --volumes --remove-orphans --rmi local
```

This method is also not too bad if your working environment got screwed up somehow and you'd like to try a fresh start.

## Internals

Here follows a dicussion about why certain things were done a certain way in this repository.

### Mounts

The current directy is mounted by _docker-compose_ into the running containers.
The main advantage is a much simpler workflow, because it allows you to change your 'local' files and they are immediately picked up by the commands in the server.
I.e. you don't have to re-build the Docker images after every code change.

# Cypress testing

 Generally check the docs:
 - [CypressOnRails](https://github.com/shakacode/cypress-on-rails#cypressonrails)
 - [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)

 ## Quickstart

### Run tests in Docker

```bash
docker-compose run cypress
docker-compose down
```

If you want to run the tests against a running dev server:

```bash
docker-compose run --rm --no-deps -e CYPRESS_BASE_URL=http://app:3000 cypress
```

_Note: You can only connect to servers running inside docker-compose. If you need that, check [here](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/)._

### Using GUI
 1. `docker-compose up -d cypressserver`
 2. Install [yarn](https://yarnpkg.com/en/docs/install)
 3. Go to `.docker/cypress/spec` in your shell.
 4. Install the testing dependencies (might take a while): `yarn install --frozen-lockfile`
 5. `yarn run ci:wait && yarn run cypress:open`
 6. Start adding tests, they get rerun automatically when open!

### Using GUI in Docker

#### Linux
 1. Run `xhost local:root` to allow the root user from the Docker container to send messages to the X server
 2. `docker-compose run cypress-gui` This will run hitobito with Cypress (if it is not already running), wait for the seeding to finish and then open the Cypress GUI.

#### Mac

_It is probably easier, faster and cleaner to use cypress directly (check above)._

 1. Install the XQuartz X11 server (`brew cask install xquartz`) and restart your machine
 2. Open XQuartz, go to settings and "Allow connections from network clients" (further reference [here](https://sourabhbajaj.com/blog/2017/02/07/gui-applications-docker-mac/#run-xquartz)) 
 3. In the project directory, run `IP=$(ipconfig getifaddr en0)`. (You might want to adjust the  `en0` to your network interface of choice…)
 4. Run `xhost + $IP` to allow the Docker container to send messages to the X server
 5. Run `DISPLAY=$IP:0 docker-compose run cypress open --project .`

 #### Windows

 _ Not yet tested_

https://dev.to/darksmile92/run-gui-app-in-linux-docker-container-on-windows-host-4kde

When you have set everything up, you should be able to start the same as on the mac…
 
 ## Options

 ### Different port/base url

 If you don't want to run the test server on port 5002 or on another host you can either edit the baseURL in `.docker/cypress/spec/cypress.json` or set an env var before starting: `export CYPRESS_BASE_URL=http://localhost:8080`
## Description

Hello! This is a small educational project. It is based on the udemy course with small improvements:
* minor changes to support newer node version 
* more unit tests
* docker
* swagger
* github actions
* this nice README file :) 

## Installation

This is a nodejs project with yarn. So, go ahead to set it all up!

1. Install NodeJS: https://nodejs.org/en/download/
2. Install yarn: 

```bash
$ npm install --global yarn
```

3. Download the project and run from the project directory to install the dependencies:

```bash
$ yarn install
```

4. Set up the database. This project expects postgresql to be used. You can do it whatever you want, but it is recommended to use docker. 
So, please, install docker: https://www.docker.com/products/docker-desktop
Than pgadmin to easier management: https://www.pgadmin.org/download/
And run the docker with the postgres:

```bash
$ docker run --name postgres-nest -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```
5. Create the database called `task-management` (please note that you can name it whatever you want, just don't forget to change `.env.stage.dev` file) in the pgadmin.


## Running the app

Once you set up the project, you can run it in two ways:

1. Just locally.

```bash
$ yarn start:dev
```

2. In the docker.
```bash
# Firstly build an image (don't miss the dot at the end of the line):
$ docker build -t task-manager .

# Than run it in the development mode:
$ docker run -e STAGE=dev -p3000:3000 task-manager
```

No matter now you run the app, it will be available by the address:
http://localhost:3000/

And you can find API documentation by following the link:
http://localhost:3000/api/

Enjoy :) 

## Test
There are some tests in the project. To run them you can just type the following command:

```bash
$ yarn test
```

If you want to check out a coverage, please type this:
```bash
$ yarn test:cov
```

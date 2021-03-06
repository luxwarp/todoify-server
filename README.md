# <img src="https://cloud.codeiolo.org/s/ZK9G8HatXKb69Zx/preview" width="35" style="margin-right: 15px;" alt="todoify icon">Todoify Server

## Intro

Todoify Server, a simple to-do with categories, REST API built with NodeJS, [Express](https://github.com/expressjs/express/), [JWT](https://github.com/auth0/node-jsonwebtoken), and [Mongoose](https://github.com/Automattic/mongoose).
Authenticated users can only get and manipulate categories and to-do's that matches the authenticated user.

<a href="https://cloud.codeiolo.org/s/GMoQXwTYSHDLQgz/preview">
  <img src="https://cloud.codeiolo.org/s/GMoQXwTYSHDLQgz/preview" width="700">
</a>

If you want to use our public API to build your own front-end
[Check our API documentation on postman for endpoint descriptions.](https://documenter.getpostman.com/view/1602420/S1Zz6UxQ)

Stay tuned for updates in a near future! :D

**Features**

- User
  - Registration
  - Account activation
  - Authentication (login)
  - Get user info
  - Update user
  - Delete user
  - Logout (disable all refresh tokens.)
  - Refresh Token
  - Reset password
- Categories
  - Create new
  - Get all
  - Get one by id
  - Update by id
  - Delete by id
- To-do's
  - Create new
  - Get all
  - Get one by id
  - Update by id
  - Delete by id

Check [wiki](https://github.com/codeiolo/todoify-server/wiki) for change log and more information.

We also have have a separate [Todoify client](https://github.com/codeiolo/todoify-client) built with VueJS. It's also open source and interacts with Todoify server. Try out Todoify Client live at [todoify.codeiolo.org](https://todoify.codeiolo.org)

## Requirements

- [NodeJS](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [PM2](http://pm2.keymetrics.io/)
- SMTP server for sending mail.

**Make sure you have PM2 installed globally**

```shell
npm install pm2 -g
```

## Install

Start off by downloading Todoify Server

```shell
git clone https://github.com/codeiolo/todoify-server.git
```

cd in to your todoify-server folder and copy .env.example to .env

```shell
cp .env.example .env
```

edit your new .env file and change all information to match your own settings

```shell
nano .env
```

save .env file and then install dependencies

```shell
npm install
```

**Make sure you have PM2 installed globally**

```shell
npm install pm2 -g
```

To start Todoify server in development mode

```shell
npm run dev
```

To start Todoify server in production mode

```shell
npm run production
```

You should now see in your console that Todoify server is running. Todoify server runs with help of [PM2](http://pm2.keymetrics.io/) so if the server crashes while running it restarts automatically, both in development and production mode.

If you don't want to start Todoify server with PM2 you can run

```shell
npm run single-start
```

or just

```shell
node ./index.js
```

If Todoify server loses connection to your MongoDB server it will try to reconnect every 5 second until you kill the Todoify server manually or it gets connected again.

By default Todoify server does not use HTTPS, the easiest way to get your connection encrypted is by using a web server like Nginx or Apache and proxy your traffic from your domain via SSL and down to Todoify server that runs on it's own port.

## License

ISC [Mikael Luxwarp Carlsson](https://codeiolo.org)

## Note

Feel free to contribute the way you want.

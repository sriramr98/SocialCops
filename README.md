# Social Cops API

- How to run the project
  1. Docker method
     - Create a .env file at the root
     - Add `MONGODB_URI = "mongodb://socialmongo:27017/socialcops"` in the .env file
     - Do a docker-compose build
     - Do a docker-compose up
     - Docker exposes PORT 80. So use `http://localhost/` as the BASE URL.
  2. Non-docker method
     - Delete the `MONGODB_URI` variable from .env if you have one.
     - Do a `npm install`
     - Do a `npm run server` to run the server using `nodemon`.
     - Do a `npm start` if you want to do a normal run
     - This exposes PORT 3000. So use `http://localhost:3000/` as the BASE URL

* How to test the project

  Testing is not implemented with docker right now, so make sure you remove the `MONGODB_URI` from the .env file and run `npm run test`.

* How to run a lint test
  1. If you have eslint installed globally, just run `eslint .`.
  2. If you do not have eslint installed globally, run `./node_modules/.bin/eslint .`.

The documentation can be found at https://documenter.getpostman.com/view/4403634/RzfcKqR3

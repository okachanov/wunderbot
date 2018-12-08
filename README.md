# Wunderbot
Telegram to Wunderlist integration bot.

## Required
* PostgreSQL
* Node 10.6+

## Installation
```bash
$ npm install
```

## Configuring
Rename .env.example to .env and set all it's variables with your own data.

If you are using Heroku, you can leave database config blank, app will take it from DATABASE_URL env param set by Heroku.

## Running the app
```bash
# development
$ npm run start:dev

# production
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

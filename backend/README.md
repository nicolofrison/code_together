# code_together

Web-based code editor that allows multiple users to collaboratively edit code in real-time

## Installation

I have used node v18.18.0 to develop the application

### Database
A database is provided through the docker-compose
Use the same data in the backend .env and the docker-compose

### Backend
Go to the `backend` folder and run `npm install`

#### .env
PORT=8080

JWT_SECRET=secret
JWT_EXPIRATION=#time in seconds

PGHOST=databse url
PGPORT=databse port
PGUSER=databse user
PGPASSWORD=databse password
PGDATABASE=databse name

#### Database migrations
To install the migrations in the database, with database up and running, `npm run migration:migrate`

## Developer's manual

### create new migration
Create/Edit any entity
npm run migration:generate Name-of-the-migration

### Src folder structure

`config`: contains the needed configurations (database and git)
`controllers`: contains the apis entrypoints divided by main root (`/auth` -> `authController`, `/codes` -> `CodeController`, `/codeHistories` -> `CodeHistoriesController`)
`middlewares`: contains the custom middlewares (authentication, error and body validation)
`migrations`: contains the database migrations
`models`: contains the models used in the app, divided by scopes in subfolders (`entities`, `http`,  `exceptions`)
`repositories`: contains the logic to interact with the datasource (the database models are contained in `models/entities`)
`services`: contains the business logic and they interact each other only in one-way to avoid circular dependencies
`utils`: utilities classes or methods used across the application with only outside dependencies
`server.ts`: contains the initialization of the express server (with the injected controllers) and the websocket server, and define the middlewares before and after all the routes
`index.ts`: Connect to the database, initialize the controllers and create the server with them

### Add new controller
To add a new controller to the application, create a controller class inside `src/controllers` that extends `Controller`
`Controller` is the base class for the controller that contains the initialization of the express router and defined the abstract methods to be implemented by the controller. It is contained in `src/models/http/controller.ts`
Each controller contains a `initRoutes` where the controller endpoints are created through express `router` field contained in the base class

#### Post requests with body validation
For the posts requests there is the `validatorMiddleware` contained in `src/middlewares/validation.middleware.ts`, a function that take the expected body object type as param and return the middleware that checks if the body respect the type checked through the `class-validator` package

#### Restricted resources that needs authentication
For the resource with restricted access that needs the user to be authenticated, there is the `authMiddleware` (`src/middlewares/auth.middleware.ts`), that checks the jwt, retrieve the user from the database and provide it to the api method as `RequestWithUser` (`src/models/http/requests/requestWithUser.interface.ts`)

#### Error handling
For the errors there is the error middleware (`src/middlewares/error.middleware.ts`) that handle the errors. If the error received is not a `HttpError` (`src/models/http/errors/HttpError.ts`) type, it would return 500 as the status of the response, otherwise it would take the information from the HttpError
To return an error to the request, throw an `HttpError` in the endpoint method that will be catched by the error handler

### Endpoints middlewares
Every endpoint has middlewares before and after defined in `server.initPreRequestMiddlewares` and in `server.initPostRequestMiddlewares` (`src/server.ts`)
Every `{controllerClass}.initRoutes` define the middlewares of the endpoints inside the controller

#### Auth
post /auth/signup => validationMiddleware(AuthPost) -> authController.signUp
post /auth/signin => validationMiddleware(AuthPost) -> authController.signIn

#### Codes
get /codes => authMiddleware -> codeController.findAll
get /codes/:id => authMiddleware -> param('id).isInt() -> codeController.findById

#### CodeHistories
get /codeHistories => authMiddleware -> codeController.queryCodeIdMiddleware -> codeHistoryController.findAll
post /codeHistories => authMiddleware -> validationMiddleware(CodeHistoryPost) -> codeHistoryController.create
get /codeHistories/:id => authMiddleware -> param('id).isInt() -> codeController.findById
delete /codeHistories/:id => authMiddleware -> param('id).isInt() -> codeController.delete
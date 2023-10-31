# code_together

Web-based code editor that allows multiple users to collaboratively edit code in real-time

## Features
Guest:
- Edit code
- Set code editor syntax
- Sign up
- Sign in
Authenticated user:
- Create or join a code session (through code)
- Edit code shared in real time with other users in the same session
- Chat with the other users in the same session
- Sign out
- With a created session:
  - show code history
  - delete last code history
  - commit current code
- With a joined session:
  - Cannot edit before the receipt of the code from anyone else in the group

The reload of the browser and the logout would reset the chat
The reload of the browser would reset the code editor
The sign in would reset the code either if the user choose to create a session and there is already an history or the user join a session

## Technologies used

Database: postgres through docker
Backend: nodejs, express, typescript, websocket, typeorm, jwt, git
Frontend: React, MaterialUI, websocket, axios

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

#### Run
Execute `npm start`

### Frontend
Go to the `frontend` folder and run `npm install`

#### .env
REACT_APP_BACKEND_URL=backend url
REACT_APP_BACKEND_PORT=backend port

#### Run
Execute `npm start`
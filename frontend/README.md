# code_together

Web-based code editor that allows multiple users to collaboratively edit code in real-time

## Installation

I have used node v18.18.0 to develop the application\
Run `npm install`

### .env
```
REACT_APP_BACKEND_URL=backend url
REACT_APP_BACKEND_PORT=backend port
```
### Run
Execute `npm start`

## Developer's manual

### Src folder structure

- `component`: contains all the react components and relative css
- `models`: contains the models used in the app, divided by scopes in subfolders (`http`,  `interfaces`)
- `services`: contains the api calls to the backend (`code.service.ts`, `codeHistory.service.ts`, `user.service.ts`) that implements the `baseAuth` to make the calls with token included (if exists), the websocket service for the websocket business logic and the alert service to manage the app alerts
- `utils`: utilities classes or methods used across the application (`errorHandler.ts` for apis error handling, `Observer.ts` to implement the observer pattern, `UserUtils` to manage the user accross the application with the session storage),

### Alert Service
The alert service is used to show an alert using the same component across the application. The `TopAlert` component is declare at the base of the application inside `App.tsx`. It uses a singleton `AlertService` that use a callback to set the alert data to the AlertComponent.\
The AlertComponent use the alert service singleton and inject the callback to set the alert data to the alert service. Anytime the alert service is called to show the alert, the data passed as parameters to the alert service will be used to call the alert component callback to show the alert

### Restricted components that needs authentication
For the components with restricted access that needs the user to be authenticated, there is the `isLoggedIn` property from the `AuthContext` to check if the user is logged in or not.

#### logged in mechanism
On `userService` (`src/services/user.service.ts`) sign in backend call, if the response is successfull, the user will be set to `UserUtils` (`src/utils/UserUtils.ts`), and from it to the session storage.\
`UserUtils` is an observable object for the `isLoggedIn` field that defined if the user is logged in or not (boolean). On the update of this field, the observable will notify the observers about the change.\
`AuthContext` (`src/components/contexts/AuthContext.tsx`) is an observer of `UserUtils`, and it is a react context used to manage the `isLoggedIn` boolean across the UI components. On `UserUtils` `isLoggedIn` update, it will notify the `AuthContext` that will provide the value to the sub components.\
To get the user, use `UserUtils`. To sign out, use `userService.signOut()`. To get if the user is logged in or not, if it is a UI component that needs it, use the `AuthContext`, otherwise implement the observer and attach to the UserUtils.

### Websocket
The websocket logic is implemented in `webSocketService` (`src/services/webSocket.service.ts`). It is used by the code editor, to share the code, and by the chat. As soon as the user log in and create or join a session, the websocket connection is established and authenticated through the jwt (The jwt is sent, and if not valid, the connection is close).\
To connect in the same session, the `wsCode` is set as protocol in the websocket connection, so only the user on the same protocol can communicate between each other.\
The websocket send the jwt only to authenticate in the first request, than it doesn't send it anymore, so it doesn't check anymore if the user is logged in or not.\
The websocket send `WebSocketMessage` (`src/models/interfaces/webSocketMessage.interface.ts`) objects. The object has a type `MessageType`. Auth is used for the first message authentication and relative response, Code for sending the text from the code editor, and the chat.\
Anytime something is updated in the file `src/models/interfaces/webSocketMessage.interface.ts`, update also the relative file in the backend (`backend/src/models/webSocketMessage.interface.ts`).

### Error handling
For the errors there is the error handler (`src/utils/errorHandler.ts`) that receive the error and show the alert for it.

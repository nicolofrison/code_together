import AuthController from './controllers/auth.controller';
import express from 'express';

const app = express();
const port = 8080; // default port to listen

AuthController.init(app);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

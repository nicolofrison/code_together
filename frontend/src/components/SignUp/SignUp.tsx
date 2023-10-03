import { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import AuthPost from '../../models/http/requests/authPost';
import UserService from '../../services/user.service';
import { AxiosError, AxiosResponse } from 'axios';
import userService from '../../services/user.service';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    const authPost: AuthPost = {
      email,
      password
    };
    UserService.signUp(authPost)
      .then((res: AxiosResponse) => {
        console.debug(res.data);
      })
      .catch((error: Error | AxiosError) => {
        console.error(error);
      });
  };

  const handleFormSubmit = async () => {
    if (password !== confirmPassword) {
      console.log('Error: passwords do not match');
      return;
    }

    try {
      const user = await userService.signUp({ email, password });

      console.log(user);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoComplete="email"
              type="email"
              name="email"
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

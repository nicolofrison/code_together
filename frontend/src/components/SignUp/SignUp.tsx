import { FormEvent, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import UserService from '../../services/user.service';
import { ButtonGroup } from '@mui/material';
import validator from 'validator';
import { AlertType } from '../Utils/TopAlert';
import AlertService from '../../services/alert.service';
import handleError from '../../utils/errorHandler';

const alertService = AlertService.getInstance();
const userService = UserService.getInstance();

const enum ModeEnum {
  signIn,
  signUp
}

export default function SignUp() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.signUp);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false
  });
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const isConfirmPasswordError = () => {
    return mode === ModeEnum.signUp && formData.password !== confirmPassword;
  };

  const isEmailError = () => {
    return !validator.isEmail(formData.email);
  };

  const isPasswordError = () => {
    return !validator.isStrongPassword(formData.password, {
      minLength: 8,
      minLowercase: 0, // default 1
      minUppercase: 0, // default 1
      minNumbers: 0, // default 1
      minSymbols: 0 // default 1
    });
  };

  // implemented separetely because if both the other useEffect will work on the submittedOnce change, one would overwrite the other
  useEffect(() => {
    setErrors({
      email: submittedOnce && isEmailError(),
      password: submittedOnce && isPasswordError(),
      confirmPassword: submittedOnce && isConfirmPasswordError()
    });
  }, [submittedOnce]);

  useEffect(() => {
    setErrors({ ...errors, email: submittedOnce && isEmailError() });
    console.log('email validation');
  }, [formData.email]);

  useEffect(() => {
    setErrors({
      ...errors,
      password: submittedOnce && isPasswordError(),
      confirmPassword: submittedOnce && isConfirmPasswordError()
    });
  }, [formData.password, confirmPassword]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    setSubmittedOnce(true);

    if (isEmailError() || isPasswordError() || isConfirmPasswordError()) {
      return;
    }
    if (mode === ModeEnum.signUp) {
      try {
        const user = await userService.signUp(formData);

        alertService.showAlert(
          'The user signed up successfully',
          AlertType.success
        );
        console.log(user);
      } catch (e) {
        console.error(e);
        handleError(e as Error);
      }
    } else {
      try {
        const user = await userService.signIn(formData);

        alertService.showAlert(
          'The user authenticated successfully',
          AlertType.success
        );
        console.log(user);
      } catch (e) {
        console.error(e);
        handleError(e as Error);
      }
    }
  };

  return (
    <Grid container alignItems="center" direction="column" spacing={2}>
      <Grid item>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
      </Grid>
      <Grid item>
        <form method="post" onSubmit={handleSubmit}>
          <Grid container alignItems="center" direction="column" spacing={2}>
            <Grid item>
              <ButtonGroup
                variant="outlined"
                aria-label="Select Sign In or Sign Up"
              >
                <Button
                  id="signUpModeButton"
                  onClick={() => setMode(ModeEnum.signUp)}
                  variant={mode === ModeEnum.signUp ? 'contained' : 'outlined'}
                >
                  Sign Up
                </Button>
                <Button
                  id="signInModeButton"
                  onClick={() => setMode(ModeEnum.signIn)}
                  variant={mode === ModeEnum.signIn ? 'contained' : 'outlined'}
                >
                  Sign In
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="email"
                name="email"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                autoFocus
                error={errors.email}
                helperText={!errors.email ? '' : 'The email is invalid'}
                onChange={handleChange}
                value={formData.email}
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
                error={errors.password}
                helperText={
                  !errors.password
                    ? ''
                    : "The password doesn't match the pattern: at least 8 charactes length"
                }
                onChange={handleChange}
                value={formData.password}
              />
            </Grid>
            {mode === ModeEnum.signUp && (
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
                  error={errors.confirmPassword}
                  helperText={
                    !errors.confirmPassword ? '' : 'The passwords do not match'
                  }
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            )}
            <Grid item>
              <Button
                size="large"
                variant="contained"
                color="primary"
                type="submit"
              >
                {mode === ModeEnum.signUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

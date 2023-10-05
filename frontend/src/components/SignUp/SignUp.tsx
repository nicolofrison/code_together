import { FormEvent, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import userService from '../../services/user.service';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import validator from 'validator';
import { AlertType } from '../Utils/TopAlert';
import alertService from '../../services/alert.service';

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

  useEffect(() => {
    if (
      mode === ModeEnum.signUp &&
      submittedOnce &&
      formData.password !== confirmPassword
    ) {
      setErrors({ ...errors, confirmPassword: true });
      return;
    }
  }, [formData.password, confirmPassword, submittedOnce]);

  useEffect(() => {
    if (submittedOnce && !validator.isEmail(formData.email)) {
      setErrors({ ...errors, email: true });
      return;
    }
    console.log('email validation');
  }, [formData.email]);

  useEffect(() => {
    if (
      submittedOnce &&
      !validator.isStrongPassword(formData.password, {
        // minLength: 8 default
        minLowercase: 0, // default 1
        minUppercase: 0, // default 1
        minNumbers: 0, // default 1
        minSymbols: 0 // default 1
      })
    ) {
      setErrors({ ...errors, password: true });
      return;
    }
    console.log('password validation');
  }, [formData.password]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    setSubmittedOnce(true);

    if (Object.values(errors).some((e) => e)) {
      return;
    }
    if (mode === ModeEnum.signUp) {
      if (formData.password !== confirmPassword) {
        console.log('Error: passwords do not match');
        return;
      }

      try {
        const user = await userService.signUp(formData);

        alertService.showAlert(
          'The user signed up successfully',
          AlertType.success
        );
        console.log(user);
      } catch (e) {
        console.error(e);
        alertService.showAlert((e as Error).message, AlertType.error);
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
        alertService.showAlert((e as Error).message, AlertType.error);
      }
    }
  };

  return (
    <div>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <form method="post" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <RadioGroup
              aria-label="mode"
              name="mode"
              value={mode}
              onChange={(e) =>
                e.target.value === ModeEnum.signIn.toString()
                  ? setMode(ModeEnum.signIn)
                  : setMode(ModeEnum.signUp)
              }
            >
              <FormControlLabel
                value={ModeEnum.signUp}
                control={<Radio />}
                label="Sign Up"
              />
              <FormControlLabel
                value={ModeEnum.signIn}
                control={<Radio />}
                label="Sign In"
              />
            </RadioGroup>
          </Grid>
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
              {errors.confirmPassword.toString()}
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
          <Grid item xs={6}>
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
    </div>
  );
}

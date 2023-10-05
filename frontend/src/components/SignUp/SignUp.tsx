import { ChangeEvent, FormEvent, useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import userService from '../../services/user.service';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import AuthPost from '../../models/http/requests/authPost';

const enum ModeEnum {
  signIn,
  signUp
}

export default function SignUp() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.signUp);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    // Prevent the browser from reloading the page
    e.preventDefault();

    if (mode === ModeEnum.signUp) {
      if (formData.password !== confirmPassword) {
        console.log('Error: passwords do not match');
        return;
      }

      try {
        const user = await userService.signUp(formData);

        console.log(user);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const user = await userService.signIn(formData);

        console.log(user);
      } catch (e) {
        console.error(e);
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

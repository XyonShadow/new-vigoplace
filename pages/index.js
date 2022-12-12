import * as React from 'react';
import { signIn, signOut, useSession } from "next-auth/react"
import HomeLayout from "../src/layouts/HomeLayout"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router'


function Copyright(props) {

  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://vigoplace.com">
        Vigoplace
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {
  const router = useRouter()

  const handleSubmit = (event) => {
    event.preventDefault();
    // router.push('/dashboard')
    // signIn()
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('username'),
      password: data.get('password'),
    });
    signIn("credentials", {
      username: data.get('username'),
      password: data.get('password'),
      callbackUrl: `${window.location.origin}/dashboard`,
      // redirect: false,
    })
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email Address"
              name="username"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

Login.getLayout = function getLayout(page) {
    return (
        <HomeLayout> {page}</HomeLayout>


    )
}



// import React from 'react'
// import HomeLayout from "../src/layouts/HomeLayout"
// import {
//     Grid,
//     Stack,
//     TextField,
//     Checkbox,
//     FormGroup,
//     FormControlLabel,
//     RadioGroup,
//     Radio,
//     FormLabel,
//     FormControl,
//     Button,
//     Box
// } from "@mui/material";
// import BaseCard from "../src/components/baseCard/BaseCard";

// const Login = () => {
//     return (
//         <Grid
//             container
//             spacing={0}
//             // direction="column"
//             alignItems="center"
//             justifyContent="center"
//             style={{ minHeight: '100vh' }}
//         >
//             <Grid item xs={12} lg={6}>
//                 <BaseCard title="Welcome Back">
//                 <h3>Enter your Email and password to signin</h3>
//                     <Stack spacing={3}>
//                         <TextField
//                             id="email-basic"
//                             label="Email"
//                             variant="outlined"
//                         // error
//                         />
//                         <TextField
//                             id="pass-basic"
//                             label="Password"
//                             type="password"
//                             variant="outlined"
//                         />
//                     </Stack>
//                     <br />
//                     <Button sx variant="contained" mt={2}>
//                         Submit
//                     </Button>
//                 </BaseCard>
//             </Grid>

//         </Grid>
//     );
// };


// Login.getLayout = function getLayout(page) {
//     return (
//         <HomeLayout> {page}</HomeLayout>


//     )
// }

// export default Login
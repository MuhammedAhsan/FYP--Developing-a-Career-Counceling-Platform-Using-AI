import { Box, Button, Card, Checkbox, Divider, FormControl, FormControlLabel, FormLabel, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import axios from 'axios';
import { useUser } from '../components/UserContext';

const LoginPage = () => {
  const navigate = useNavigate()
  const {setUser} = useUser()
  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const validateInputs = () => {

  }

  const handleForgetPassword = () => {

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if(!data.email && !data.password){
      alert('Email and Password are required')
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login/',
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setUser(response.data.user)
      // navigate(`/dashboard/${encodeURIComponent(data.email)}`);
      navigate(`/`);
      console.log(response)

    } catch (error) {
      console.error('Server response:', error.response?.data);
      // alert(`Error: ${error.response?.data?.message || 'Check console'}`);
    }

  }

  return (
    <Box sx={{
      // height: `calc((1 - var(--template-frame-height, 0)) * 100dvh)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '97vh',
      boxSizing: 'border-box',
      overflow: 'hidden',
      backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    }}>
      <Card sx={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: 4,
        gap: 2,
        margin: 'auto',
        maxWidth: {
          sm: '450px',
        },
        boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
        maxHeight: '100%',
        overflow: 'hidden',
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Typography
            component='h1'
            variant='h4'
            sx={{
              width: '100%',
              fontSize: 'clamp(2rem, 10vw, 2.15rem)',
              fontWeight: 'bold',
              pb: 2
            }}
          >
            Login
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2
            }}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </FormControl>

            {/* <FormControlLabel
              control={<Checkbox />}
              label='Remember me'
            /> */}

            <Button
              type='submit'
              fullWidth
              variant='contained'
              onClick={validateInputs}
            >
              Login
            </Button>

            <Link
              type='button'
              component='button'
              variant='body2'
              onClick={handleForgetPassword}
              sx={{ alignSelf: 'center' }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Divider>OR</Divider>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {/* <Button
              fullWidth
              variant='contained'
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button> */}

            {/* <Button
              fullWidth
              variant='contained'
              onClick={() => alert('Sign in with LinkedIn')}
              startIcon={<LinkedInIcon />}
            >
              Sign in with LinkedIn
            </Button> */}

            <Typography sx={{ textAlign: 'center' }}>
              Don&apos;t have an account?{' '}
              <Link
                to='/create-profile'
                variant='body2'
                sx={{ alignSelf: 'center' }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default LoginPage
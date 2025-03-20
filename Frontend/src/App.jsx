import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';

export default function App() {
  const [email, setEmail] = useState('');

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Career Counselor
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/create-profile">
            Create Profile
          </Button>
          <Button color="inherit" component={Link} /*to="/dashboard"*/ onClick={() => navigate(`/recommendations/:email`)}>
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={
            <>
              <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'center' }} gutterBottom>
                Welcome to AI Career Counseling Platform
              </Typography>
              <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} gutterBottom>
                Click on 
                <Button variant="contained" color="primary" size="small" sx={{mx: 2}} component={Link} to="/create-profile">Create Profile</Button>
                for profile creation
              </Typography>
            </>
          } />

          <Route path="/create-profile" element={
            <ProfileForm onProfileCreated={(userEmail) => setEmail(userEmail)} />
          } />

          <Route path="/dashboard/:email" element={<Dashboard email={email} />} />

          {/* <Route path="*" element={<h1>404 Not Found</h1>} /> */}
        </Routes>
      </Container>
    </Router>
  );
}
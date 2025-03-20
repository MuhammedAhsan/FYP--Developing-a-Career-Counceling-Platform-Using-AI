// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

export default function Dashboard() {
  const { email } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/recommendations/${encodeURIComponent(email)}/`
        );
        
        console.log('API Response:', response.data);
        
        if (response.data.recommendations && response.data.recommendations.length > 0) {
          setRecommendations(response.data.recommendations);
        } else {
          setError('No recommendations found. Try adding more skills!');
        }
      } catch (error) {
        console.error('API Error:', error.response?.data);
        setError(error.response?.data?.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [email]);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Career Recommendations for <strong>{email}</strong>
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {recommendations.map((career) => (
            <ListItem key={Math.random()} divider>
              <ListItemText primary={career} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}
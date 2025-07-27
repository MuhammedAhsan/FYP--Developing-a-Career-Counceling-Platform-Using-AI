// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useUser } from '../components/UserContext';
import { useRecommendation } from '../components/RecommendationContext';

export default function CourseRecommendation() {
  const { user } = useUser()
  const { setRecommendation } = useRecommendation()
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.email) {
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8000/api/recommendations/${encodeURIComponent(user.email)}/`
        );

        // console.log('API Response:', response.data.recommendations);
        const job_items = response.data.recommendations
        // const jobs = job_items.map((item) => item['Job Title'])
        // setRecommendations(jobs)
        // console.log(recommendations)
        // console.log(jobs)
        setRecommendation(job_items)

        if (job_items && job_items.length > 0) {
          const jobs = job_items.map((item) => item['Job Title'])
          setRecommendations(jobs)
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
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Career Recommendations for <strong>{user?.name}</strong>
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {recommendations.map((career, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={career} />
            </ListItem>
          ))}
          {/* <ListItem key={Math.random()} divider>
              <ListItemText primary={recommendations} />
            </ListItem> */}
        </List>
      )}
    </div>
  );
}
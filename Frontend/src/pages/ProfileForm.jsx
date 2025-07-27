import * as React from 'react';
import axios from 'axios';
import { Box, Stepper, Step, StepLabel, Button, Typography, TextField, Select, MenuItem, InputLabel, FormControl, Chip, Grid, Card } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const steps = ['Personal Detail', 'Educational Detail', 'Skills/Interests/Career Goals'];

export default function ProfileForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [currentInterest, setCurrentInterest] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    education: [{
      degree: '',
      institution: '',
      startYear: '',
      endYear: ''
    }],
    skills: [{
      name: '',
      level: 'Beginner'
    }],
    interests: [],
    career_goals: '',
  });


  // --- Form handlers ---
  // Education Handlers
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData({ ...formData, education: updatedEducation });
  };

  const addEducationField = () => {
    setFormData({
      ...formData,
      education: [...formData.education, {
        degree: '',
        institution: '',
        startYear: '',
        endYear: ''
      }]
    });
  };

  // Skill Handlers
  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index][field] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const addSkillField = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: '', level: 'Beginner' }]
    });
  };

  // Interest Handlers
  const handleInterestKeyPress = (e) => {
    if (e.key === 'Enter' && currentInterest.trim()) {
      setFormData({
        ...formData,
        interests: [...formData.interests, currentInterest.trim()]
      });
      setCurrentInterest('');
    }
  };

  const removeInterest = (index) => {
    const updatedInterests = formData.interests.filter((_, i) => i !== index);
    setFormData({ ...formData, interests: updatedInterests });
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission is working")

    // Client-side validation
    if (!formData.name || !formData.email) {
      alert('Name and Email are required!');
      return;
    }

    // Clean data
    const postData = {
      ...formData,
      education: formData.education.filter(edu =>
        edu.degree.trim() && edu.institution.trim()
      ),
      skills: formData.skills.filter(skill =>
        skill.name.trim() && skill.level.trim()
      )
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/users/',
        postData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      navigate(`/dashboard/${encodeURIComponent(formData.email)}`);
      console.log(formData)
    } catch (error) {
      console.error('Server response:', error.response?.data);
      alert(`Error: ${error.response?.data?.message || 'Check console'}`);
    }
  };


  // --- Stepper Handlers ---

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // Handle skip error
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%', pt: 2 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          // if (isStepOptional(index)) {
          //   labelProps.optional = (
          //     <Typography variant="caption">Optional</Typography>
          //   );
          // }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </Box>
        </React.Fragment>

      ) : (
        <React.Fragment>
          {/* Main form will be here */}
          <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', marginTop: '5vh', marginBottom: '5vh' }}>

            {/* Personal Info */}
            {activeStep === 0 && (
              <Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Full Name"
                    sx={{ pb: 1 }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    sx={{ pb: 1 }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label='Password'
                    type='password'
                    sx={{ pb: 1 }}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </Box>
              </Box>
            )}

            {/* Education Section */}
            {activeStep === 1 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Education</Typography>
                  {formData.education.map((edu, index) => (
                    <Grid container spacing={2} key={index} style={{ marginBottom: '10px' }}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Institution"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <TextField
                          fullWidth
                          label="Start Year"
                          type="number"
                          value={edu.startYear}
                          onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6} sm={2}>
                        <TextField
                          fullWidth
                          label="End Year"
                          type="number"
                          value={edu.endYear}
                          onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  ))}
                  <Button variant="outlined" onClick={addEducationField} style={{ marginTop: '10px' }}>
                    Add Education
                  </Button>
                </Grid>
              </>
            )}

            {/* Skills - Interests - Career Goals Section */}
            {activeStep === 2 && (
              <>
                {/* Skills Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Skills</Typography>
                  {formData.skills.map((skill, index) => (
                    <Grid container spacing={2} key={index} style={{ marginBottom: '10px' }}>
                      <Grid item xs={8} sm={4}>
                        <TextField
                          fullWidth
                          label="Skill Name"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <FormControl fullWidth>
                          <InputLabel>Level</InputLabel>
                          <Select
                            value={skill.level}
                            onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                            label="Level"
                          >
                            <MenuItem value="Beginner">Beginner</MenuItem>
                            <MenuItem value="Intermediate">Intermediate</MenuItem>
                            <MenuItem value="Advanced">Advanced</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  ))}
                  <Button variant="outlined" onClick={addSkillField} style={{ marginTop: '10px' }}>
                    Add Skill
                  </Button>
                </Grid>

                {/* Interests Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>Interests</Typography>
                  <TextField
                    fullWidth
                    label="Add Interests (Press Enter)"
                    value={currentInterest}
                    onChange={(e) => setCurrentInterest(e.target.value)}
                    onKeyPress={handleInterestKeyPress}
                  />
                  <div style={{ marginTop: '10px', marginBottom: '15px' }}>
                    {formData.interests.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        onDelete={() => removeInterest(index)}
                        style={{ margin: '4px' }}
                      />
                    ))}
                  </div>
                </Grid>

                {/* Career Goals */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Career Goals"
                    multiline
                    rows={4}
                    value={formData.career_goals}
                    onChange={(e) => setFormData({ ...formData, career_goals: e.target.value })}
                  />
                </Grid>

                {/* <Grid>
                  <TextField 
                    fullWidth
                    label='Education'
                    rows={4}
                    
                  />
                </Grid> */}
              </>
            )}



            {/* Stepper handle buttons */}
            <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} >
                  <Typography variant='body2' sx={{ textAlign: 'center' }}>
                    Already have an account?{' '}
                    <Link 
                      to='/login'
                      variant='body2'
                      sx={{ alignSelf: 'center' }}
                    >
                      Login
                    </Link>
                  </Typography>
                </Box>

                {/* Skip button */}
                {/* {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )} */}

                {/* Next - Finish Button */}
                <Button onClick={activeStep < steps.length - 1 ? handleNext : undefined} variant='contained' type={activeStep === steps.length - 1 ? 'submit' : 'button'}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </Box>
          </form>


        </React.Fragment>
      )}
    </Box>
  );
}
import React, { useEffect, useState } from 'react'
import { useUser } from './UserContext'
import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import { useRecommendation } from './RecommendationContext'

export const SkillGap = () => {
    // const [recommendationState, setRecommendationState] = useState(null)
    const { user } = useUser()
    const { recommendation } = useRecommendation()
    const skills = user.skills

    // useEffect(() => {
    //     const storedRecommendations = localStorage.getItem('recommendations')
    //     console.log(JSON.parse(storedRecommendations));

    //     if (storedRecommendations) {
    //         setRecommendationState(JSON.parse(storedRecommendations))
    //         console.log(recommendationState)
    //     }
    // }, [])

    return (
        <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography component='h3' variant='h6' fontWeight='bold'>User Skills</Typography>
                        <Divider sx={{ py: 1 }} />
                        <Stack direction='row' spacing={1} sx={{ py: 3 }}>
                            {
                                skills.map((skill, index) => {
                                    return <Chip key={index} label={skill.name} />
                                })
                            }
                        </Stack>
                    </Paper>
                </Grid>

                {
                    // console.log(recommendation)
                    // recommendation.map((course) => {
                    //     console.log(course)
                    // })

                    recommendation.map((course, index) => {
                        console.log(course['Technical Skills'])
                        return (
                            <Grid item key={index} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography>{course['Job Title']}</Typography>
                                    {
                                        // course['Technical SKills'].map((skill) => {
                                        // return <Chip key={index} label={skill} />
                                        // console.log(skill)
                                        // })
                                    }
                                    <Stack direction='row' spacing={1} sx={{ py: 3 }}>
                                        {
                                            course.map((skill, index) => {
                                                return <Chip key={index} label={skill} />
                                            })
                                        }
                                    </Stack>
                                </Paper>
                            </Grid>
                        )
                    })
                }

            </Grid>
        </Box>
    )
}

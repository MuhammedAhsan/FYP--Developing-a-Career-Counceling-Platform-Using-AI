import { useUser } from './UserContext'
import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import { useRecommendation } from './RecommendationContext'

export const SkillGap = () => {
    const { user } = useUser()
    const { recommendation } = useRecommendation()
    const skills = user.skills

    const userSkills = skills.map((item) => {
        return item.name
    })

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

                    recommendation.map((course, index) => {
                        // console.log(course['Technical Skills'])
                        return (
                            <Grid item key={index} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography>{course['Job Title']}</Typography>
                                    <Stack direction='column' spacing={1} sx={{ py: 3 }}>
                                        <Stack direction='row' spacing={1} sx={{ py: 3 }}>
                                            {
                                                course['Technical Skills'].map((skill, index) => {
                                                    return <Chip key={index} label={skill} />
                                                })
                                            }
                                        </Stack>
                                        <Divider sx={{ py: 1 }} />
                                        <Stack direction='row' spacing={1} sx={{ py: 3 }}>

                                            {
                                                course['Technical Skills']
                                                    .filter(item => !userSkills.map(s => s.toLowerCase()).includes(item.trim().toLowerCase()))
                                                    .map((skill_gap_item, index) => (
                                                        <Chip key={index} label={skill_gap_item} color='primary' />
                                                    ))
                                            }

                                            {/* {console.log("skills:", skills)}
                                            {console.log("skills:", userSkills)}
                                            {console.log("technical skills:", course['Technical Skills'])}
                                            {console.log("typeof course['Technical Skills'][0]:", typeof course['Technical Skills']?.[0])} */}
                                        </Stack>
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

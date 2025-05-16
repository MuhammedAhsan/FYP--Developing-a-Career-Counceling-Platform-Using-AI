import React from 'react'
import { useUser } from './UserContext'
import { Box, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material'

export const SkillGap = () => {
    const {user} = useUser()
    const skills = user.skills

  return (
    <Box sx={{flexGrow: 1, textAlign: 'left'}}>
        <Grid container spacing={2}>
            <Grid item md={12}>
                <Paper sx={{p: 2}}>
                <Typography component='h3' variant='h6' fontWeight='bold'>User Skills</Typography>
                <Divider sx={{py: 1}} />
                <Stack direction='row' spacing={1} sx={{py: 3}}>
                    {
                        skills.map((skill, index) => {
                            return <Chip key={index} label={skill.name} />
                        })
                    }
                </Stack>
                </Paper>
            </Grid>
            <Grid item md={6}>
                <Paper sx={{p: 2}}>
                <Typography>Hello</Typography>
                </Paper>
            </Grid>
        </Grid>
    </Box>
  )
}

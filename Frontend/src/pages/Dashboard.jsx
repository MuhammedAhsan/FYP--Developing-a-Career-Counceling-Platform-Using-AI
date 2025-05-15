import { Box, Grid } from '@mui/material'
import { useState } from 'react'
import { SideNav } from '../components/SIdeNav'
import { Outlet } from 'react-router-dom'

export const Dashboard = () => {
    const [grid, setGrid] = useState(2)

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={0}>
                <Grid item md={grid}>
                    <Box style={{ textAlign: 'center' }} p={2} height='100vh' bgcolor='#fafbff'>
                        <SideNav />
                    </Box>
                </Grid>
                <Grid item md={12 - grid}>
                    <Box style={{ padding: 16, textAlign: 'center' }} height='100vh' bgcolor='white'>

                        <Outlet />

                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

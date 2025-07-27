import { Box, Button, Card } from '@mui/material'
import SideTab from './SideTab'
import Logout from './Logout'

export const SideNav = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <Box>
                <SideTab title='Dashboard' link='/home' />
                <SideTab title='Chatbot' link='/chatbot' />
                <SideTab title='Recommendations' link='/recommendation' />
                <SideTab title='Skill Gap' link='/skillgap' />
            </Box>
            <Box sx={{
                position: 'fixed',
                bottom: 0,
                py: 4
            }}>
                <Card>
                    <Logout/>
                </Card>
            </Box>
        </Box>
    )
}

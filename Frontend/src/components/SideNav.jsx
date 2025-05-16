import { Box, Card } from '@mui/material'
import SideTab from './SideTab'

export const SideNav = () => {
    return (
        <Box>
            <Box>
                <SideTab title='Dashboard' link='/home' />
                <SideTab title='Chatbot' link='/chatbot' />
                <SideTab title='Recommendations' link='/recommendation' />
                <SideTab title='Skill Gap' link='/skillgap' />
            </Box>
            <Box>
                <Card 

                />
            </Box>
        </Box>
    )
}

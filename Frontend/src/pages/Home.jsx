import { Box, Card, Typography } from '@mui/material'
import { useUser } from '../components/UserContext'

export const Home = () => {
  const { user } = useUser()

  return (
    <Box>
      <Card
        sx={{
          px: 2,
          py: 4,
          textAlign: 'left',
        }}
      >
        <Typography
          variant='h6'
          sx={{
            pb: 2,
          }}
        >
          Hi {user.name}
        </Typography>
        <Typography
          component='h2'
          variant='h4'
        >
          Welcome to Career Counseling App!
        </Typography>
      </Card>
    </Box>
  )
}

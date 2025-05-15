import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import React from 'react'

const SideTab = ({title, link}) => {
    return (
        <Box>
            <Link
                to={link}
                style={{textDecoration: 'none'}}
            >
                <Typography
                    px={2}
                    py={1}
                    borderRadius={2}
                    overflow='hidden'
                    sx={{
                        textAlign: 'left',
                        color: '#333432',
                        textDecoration: 'none',
                        '&:hover': {
                            bgcolor: '#eff6ff'
                        }
                    }}
                >
                    {title}
                </Typography>
            </Link>
        </Box>
    )
}

export default SideTab
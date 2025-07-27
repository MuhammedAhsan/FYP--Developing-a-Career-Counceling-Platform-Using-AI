import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const nevigate = useNavigate()

    function handleLogout(e){
        e.preventDefault()
        localStorage.clear()
        nevigate('/login')
    }

  return (
    <Button onClick={handleLogout} size='small'>
        Logout
    </Button>
  )
}

export default Logout
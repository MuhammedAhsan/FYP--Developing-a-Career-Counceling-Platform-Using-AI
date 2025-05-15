import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Stack } from '@mui/material';
import axios from 'axios';

export const Chatbot = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const res = await axios.post('http://localhost:8000/api/chatbot/', {
                type: 'user',
                message: input
            });

            const botMessage = { sender: 'bot', text: res.data || "No reply" };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            const botError = { sender: 'bot', text: "Error: Could not reach server." };
            setMessages((prev) => [...prev, botError]);
            console.log(err)
        }

        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
            setInput('');
        }
    };

    return (
        <Box
            sx={{
                maxWidth: '700px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                height: '90vh',
                padding: 2,
                borderRadius: 2,
            }}
        >
            <Typography variant="h4" gutterBottom textAlign="center">
                Chatbot
            </Typography>

            <Paper
                elevation={1}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 2,
                    marginBottom: 2,
                    bgcolor: 'white',
                    borderRadius: 2
                }}
            >
                <Stack spacing={1}>
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                bgcolor: msg.sender === 'user' ? '#1976d2' : '#e0e0e0',
                                color: msg.sender === 'user' ? 'white' : 'black',
                                padding: 1.2,
                                borderRadius: 2,
                                maxWidth: '75%',
                                textAlign: 'left'
                            }}
                        >
                            {msg.text}
                        </Box>
                    ))}
                </Stack>
            </Paper>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button variant="contained" onClick={handleSend}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

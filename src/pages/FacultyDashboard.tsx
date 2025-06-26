import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import useAuthStore from '../store/authStore';

const FacultyDashboard: React.FC = () => {
    const { userId, logout } = useAuthStore();

    return (
        <Box p={3}>
            <Paper sx={{p: 4}}>
                <Typography variant="h4" gutterBottom>Faculty Dashboard</Typography>
                <Typography variant="h6">Welcome, Professor {userId}</Typography>
                <Typography>This page is under construction.</Typography>
                <button onClick={logout}>Logout</button>
            </Paper>
        </Box>
    );
};

export default FacultyDashboard; 
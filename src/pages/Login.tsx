import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Paper, Avatar, Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import useAuthStore from '../store/authStore';
import UidForm from '../features/auth/UidForm';
import RoleSelector from '../features/auth/RoleSelector';

const LoginPage: React.FC = () => {
  const [uid, setUid] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleUidSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (uid.trim()) {
      setStep(2);
    }
  };

  const handleRoleSelect = (role: 'admin' | 'faculty' | 'student') => {
    login(uid, role);
    navigate(`/${role}`);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {step === 1 ? 'Sign In' : 'Select Your Role'}
          </Typography>
          
          {step === 1 ? (
            <UidForm uid={uid} setUid={setUid} onSubmit={handleUidSubmit} />
          ) : (
            <RoleSelector uid={uid} onSelectRole={handleRoleSelect} />
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage; 
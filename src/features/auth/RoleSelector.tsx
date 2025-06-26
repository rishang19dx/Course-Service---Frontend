import React from 'react';
import { Box, Typography, Card, CardActionArea } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

type Role = 'admin' | 'faculty' | 'student';

const roles = [
    { name: 'Admin', icon: <SupervisorAccountIcon sx={{ fontSize: 40 }} />, role: 'admin' as const },
    { name: 'Faculty', icon: <SchoolIcon sx={{ fontSize: 40 }} />, role: 'faculty' as const },
    { name: 'Student', icon: <PersonIcon sx={{ fontSize: 40 }} />, role: 'student' as const },
];

type RoleSelectorProps = {
  uid: string;
  onSelectRole: (role: Role) => void;
};

const RoleSelector: React.FC<RoleSelectorProps> = ({ uid, onSelectRole }) => {
  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        Welcome, UID: <strong>{uid}</strong>. Please select your role to continue.
      </Typography>
      <Box display="flex" justifyContent="center" gap={2}>
        {roles.map((roleInfo) => (
          <Card key={roleInfo.role} sx={{ flex: 1 }}>
            <CardActionArea onClick={() => onSelectRole(roleInfo.role)} sx={{ p: 2, textAlign: 'center' }}>
              {roleInfo.icon}
              <Typography variant="h6">{roleInfo.name}</Typography>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default RoleSelector; 
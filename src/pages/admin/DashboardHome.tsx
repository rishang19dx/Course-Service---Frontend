import React from 'react';
import {
  Box, Typography, Paper, Divider,
  Card, CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupIcon from '@mui/icons-material/Group';

const mainNavItems = [
  { text: 'Courses Management', icon: <MenuBookIcon sx={{ fontSize: 32 }} />, path: '/admin/courses', description: 'Create, edit, and manage all course offerings.' },
  { text: 'Announcements', icon: <CampaignIcon sx={{ fontSize: 32 }} />, path: '/admin/announcements', description: 'Broadcast system-wide or course-specific news.' },
  { text: 'Student Enrollment', icon: <GroupIcon sx={{ fontSize: 32 }} />, path: '/admin/students', description: 'Manage student registrations across courses.' },
];

const stats = [
  { title: 'Total Courses', value: 12, icon: <MenuBookIcon color="primary" /> },
  { title: 'Total Students', value: 340, icon: <GroupIcon color="primary" /> },
  { title: 'Recent Announcements', value: 3, icon: <CampaignIcon color="primary" /> },
];

const cardSx = {
  display: 'flex',
  alignItems: 'center',
  p: 2,
  mb: 2,
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateX(5px)',
    boxShadow: (theme: any) => `0 4px 12px ${theme.palette.action.hover}`,
  },
};

const AdminDashboardHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        {/* Main Content */}
        <Box flexGrow={1}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          {mainNavItems.map((item) => (
            <Card key={item.text} sx={cardSx}>
              <CardActionArea onClick={() => navigate(item.path)} sx={{ display: 'flex', justifyContent: 'flex-start', p: 1 }}>
                <Box sx={{ mr: 2, bgcolor: 'primary.main', color: 'white', p: 1, borderRadius: '50%' }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="h6">{item.text}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Box>
        {/* Stats Sidebar */}
        <Box width={{ xs: '100%', md: 300 }} flexShrink={0}>
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>System Statistics</Typography>
            <Divider sx={{ mb: 2 }}/>
            {stats.map((stat) => (
              <Box key={stat.title} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 2 }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h6">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboardHome; 
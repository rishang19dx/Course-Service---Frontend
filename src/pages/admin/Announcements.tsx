import React from 'react';
import { Typography, Box, Divider, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const mockAnnouncements = [
  {
    title: 'System Maintenance',
    date: '2024-06-25',
    author: 'Admin',
    content: 'The system will be down for maintenance on June 30th from 2am to 4am.'
  },
  {
    title: 'New Course Available: AI Ethics',
    date: '2024-06-20',
    author: 'Admin',
    content: 'A new course on AI Ethics is now available for enrollment.'
  },
];

const stats = [
  { title: 'Total Announcements', value: 2 },
  { title: 'System-Wide', value: 1 },
  { title: 'Course-Specific', value: 1 },
];

const AdminAnnouncements: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Announcements</Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        {/* Main Content */}
        <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
          <Box>
            {mockAnnouncements.map((a, idx) => (
              <Box key={idx} sx={{ py: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6">{a.title}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>{a.date} — {a.author}</Typography>
                <Typography variant="body1">{a.content}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Actions Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>Actions</Typography>
            <Divider sx={{ mb: 2 }}/>
            <Button variant="contained" startIcon={<AddIcon />} fullWidth>
              Create New Announcement
            </Button>
            <Divider sx={{ my: 2 }}/>
            <Typography variant="h6" gutterBottom>Statistics</Typography>
            {stats.map((stat) => (
              <Box key={stat.title} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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

export default AdminAnnouncements; 
import React from 'react';
import { Typography, Box } from '@mui/material';

interface Announcement {
  id: number;
  title: string;
  content: string;
}

const announcementSx = {
  borderBottom: 1,
  borderColor: '#e0e0e0',
  py: 2,
  borderRadius: 0,
  transition: 'border-color 0.2s',
  '&:hover, &:focus': {
    borderColor: 'primary.main',
    outline: 'none',
  },
};

const CourseAnnouncementsTab: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => (
  <Box>
    {announcements.map((a, idx) => (
      <Box
        key={a.id}
        sx={{
          ...announcementSx,
          borderBottom: idx < announcements.length - 1 ? 1 : 0,
        }}
        tabIndex={0}
      >
        <Typography fontWeight={700} mb={0.5}>{a.title}</Typography>
        <Typography variant="body2">{a.content}</Typography>
      </Box>
    ))}
  </Box>
);

export default CourseAnnouncementsTab; 
import React from 'react';
import { Box, Typography } from '@mui/material';

interface CourseInfoTabProps {
  course: any;
}

const labelStyle = { fontWeight: 700, fontSize: '1rem', mb: 0.5, mt: 2 };

const CourseInfoTab: React.FC<CourseInfoTabProps> = ({ course }) => (
  <Box
    border={1}
    borderColor="#e0e0e0"
    borderRadius={0}
    p={2}
    tabIndex={0}
    sx={{
      transition: 'border-color 0.2s',
      '&:hover, &:focus': {
        borderColor: 'primary.main',
        outline: 'none',
      },
    }}
  >
    <Typography variant="h6" fontWeight={700} mb={2} mt={0}>
      Course Information
    </Typography>
    <Typography sx={labelStyle}>Description</Typography>
    <Typography mb={1}>{course.description}</Typography>
    <Typography sx={labelStyle}>Preamble</Typography>
    <Typography mb={1}>{course.preamble}</Typography>
    <Typography sx={labelStyle}>Term</Typography>
    <Typography mb={1}>{course.term}</Typography>
    <Typography sx={labelStyle}>Type</Typography>
    <Typography mb={1}>{course.type}</Typography>
    <Typography sx={labelStyle}>SWS</Typography>
    <Typography mb={1}>{course.sws}</Typography>
  </Box>
);

export default CourseInfoTab; 
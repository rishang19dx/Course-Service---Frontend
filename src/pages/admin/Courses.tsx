import React, { useState } from 'react';
import {
  Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Chip, IconButton, Stack, Fab, Modal, Divider, Link, Paper
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
// import styles from './Courses.module.css';
import AddCourseForm from '../../features/courses/AddCourseForm';
import { useNavigate } from 'react-router-dom';

const mockCourses = [
  {
    code: '12.00086',
    title: 'Advanced Algorithms',
    type: 'SE',
    sws: 2,
    lecturers: ['Hoefer, Martin Karl Wilhelm', 'Huth, Lars', 'Pandey, Sukanya', 'Seesemann, Finn'],
    registration: null,
  },
  {
    code: '12.00085',
    title: 'Advanced Network Security',
    type: 'LE',
    sws: 4,
    lecturers: ['Meyer, Ulrike Michaela', 'Breuer, Malte', 'Drichel, Arthur'],
    registration: 'expired',
  },
  {
    code: '12.05704',
    title: 'Advanced Study Group: Programming Verification',
    type: 'E',
    sws: 2,
    lecturers: ['Giesl, Jürgen'],
    registration: null,
  },
  {
    code: '12.00047',
    title: 'Advanced Topics in Network Science',
    type: 'SE',
    sws: 2,
    lecturers: ['Schaub, Michael Thomas'],
    registration: null,
  },
  {
    code: '12.02001',
    title: 'Advanced Topics in Reinforcement Learning and Planning',
    type: 'SE',
    sws: 2,
    lecturers: ['Geffner, Hector'],
    registration: 'expired',
  },
];

const stats = [
  { title: 'Courses Found', value: 2 },
  { title: 'Total Registered Students', value: 342 },
];

const AdminCourses: React.FC = () => {
  const [addOpen, setAddOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Courses Management</Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        {/* Main Content */}
        <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
          {/* Filters Bar */}
          <Box display="flex" flexWrap="wrap" gap={2} mb={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Term</InputLabel>
              <Select value={"2024 W"} label="Term">
                <MenuItem value="2024 W">2024 W</MenuItem>
                <MenuItem value="2024 S">2024 S</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Curriculum</InputLabel>
              <Select value={"All"} label="Curriculum">
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="CS">CS</MenuItem>
                <MenuItem value="Math">Math</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              placeholder="Filter by course number, title or person"
              InputProps={{ startAdornment: <FilterListIcon sx={{ mr: 1 }} /> }}
              sx={{ flex: 1, minWidth: 250 }}
            />
            <Button variant="outlined" startIcon={<FilterListIcon />}>Filter</Button>
            <Button variant="outlined" endIcon={<SortIcon />}>Title</Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* Course List */}
          <Stack divider={<Divider flexItem />}>
            {mockCourses.map((course) => (
              <Box
                key={course.code}
                onClick={() => navigate(`/admin/courses/${course.code}`)}
                sx={{ display: 'flex', alignItems: 'center', py: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <Box flex={1}>
                  <Link component="button" variant="h6" onClick={(e) => { e.stopPropagation(); navigate(`/admin/courses/${course.code}`); }} sx={{ textAlign: 'left' }}>
                    {course.title}
                  </Link>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {course.code} | {course.type} | {course.sws} SWS
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {course.lecturers.map((lecturer) => (
                      <Chip
                        key={lecturer}
                        icon={<PersonIcon />}
                        label={lecturer}
                        size="small"
                        component="a"
                        href="#"
                        clickable
                        onClick={(e) => e.stopPropagation()}
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ minWidth: 250, textAlign: 'right', display: 'flex', alignItems: 'center' }}>
                  {course.registration === 'expired' ? (
                    <Typography variant="body2" color="error" mr={2}>Registration expired</Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary" mr={2}>No registration</Typography>
                  )}
                  <IconButton color="primary" size="large">
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
        {/* Stats Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>Statistics</Typography>
            <Divider sx={{ mb: 2 }}/>
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
      {/* Add Course FAB */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setAddOpen(true)}
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }}
      >
        <AddIcon />
      </Fab>
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <AddCourseForm onClose={() => setAddOpen(false)} />
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminCourses; 
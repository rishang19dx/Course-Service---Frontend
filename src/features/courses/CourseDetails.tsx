import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CourseDetailsTabs from './CourseDetailsTabs';

const mockCourse = {
  code: '12.00086',
  name: 'Advanced Algorithms',
  description: 'A deep dive into advanced algorithmic techniques.',
  preamble: 'This course covers advanced topics in algorithms.',
  term: '2024 W',
  type: 'SE',
  sws: 2,
  students: [
    { id: 1, name: 'Alice Smith' },
    { id: 2, name: 'Bob Johnson' },
  ],
  announcements: [
    { id: 1, title: 'Welcome!', content: 'Welcome to the course.' },
    { id: 2, title: 'Exam Date', content: 'Exam will be held on July 10.' },
  ],
};

const mockAllStudents = [
  { id: 3, name: 'Charlie Brown' },
  { id: 4, name: 'Diana Prince' },
  { id: 5, name: 'Eve Adams' },
];

const CourseDetails: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  // Student management state
  const [students, setStudents] = useState(mockCourse.students);
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Filter students to add
  const filteredToAdd = mockAllStudents.filter(
    s =>
      !students.some(stu => stu.id === s.id) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Remove student
  const handleRemove = (student: any) => {
    setSelectedStudent(student);
    setRemoveDialogOpen(true);
  };
  const confirmRemove = () => {
    setStudents(students.filter(s => s.id !== selectedStudent.id));
    setRemoveDialogOpen(false);
    setSelectedStudent(null);
  };

  // Add student
  const handleAdd = (student: any) => {
    setSelectedStudent(student);
    setAddDialogOpen(true);
  };
  const confirmAdd = () => {
    setStudents([...students, selectedStudent]);
    setAddDialogOpen(false);
    setSelectedStudent(null);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back to Courses
      </Button>
      <Typography variant="h5" mb={1}>{mockCourse.name} ({mockCourse.code})</Typography>
      <CourseDetailsTabs
        course={mockCourse}
        students={students}
        allStudents={mockAllStudents}
        search={search}
        setSearch={setSearch}
        filteredToAdd={filteredToAdd}
        onRemove={handleRemove}
        onAdd={handleAdd}
        removeDialogOpen={removeDialogOpen}
        setRemoveDialogOpen={setRemoveDialogOpen}
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        selectedStudent={selectedStudent}
        confirmRemove={confirmRemove}
        confirmAdd={confirmAdd}
      />
    </Box>
  );
};

export default CourseDetails; 
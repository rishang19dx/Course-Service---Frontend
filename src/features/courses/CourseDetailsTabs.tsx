import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import CourseInfoTab from './CourseInfoTab';
import CourseStudentsTab from './CourseStudentsTab';
import CourseAnnouncementsTab from './CourseAnnouncementsTab';

const CourseDetailsTabs = ({
  course,
  students,
  allStudents,
  search,
  setSearch,
  filteredToAdd,
  onRemove,
  onAdd,
  removeDialogOpen,
  setRemoveDialogOpen,
  addDialogOpen,
  setAddDialogOpen,
  selectedStudent,
  confirmRemove,
  confirmAdd
}: any) => {
  const [tab, setTab] = useState(0);
  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Details" />
        <Tab label="Registered Students" />
        <Tab label="Announcements" />
      </Tabs>
      {tab === 0 && <CourseInfoTab course={course} />}
      {tab === 1 && (
        <CourseStudentsTab
          students={students}
          allStudents={allStudents}
          search={search}
          setSearch={setSearch}
          filteredToAdd={filteredToAdd}
          onRemove={onRemove}
          onAdd={onAdd}
          removeDialogOpen={removeDialogOpen}
          setRemoveDialogOpen={setRemoveDialogOpen}
          addDialogOpen={addDialogOpen}
          setAddDialogOpen={setAddDialogOpen}
          selectedStudent={selectedStudent}
          confirmRemove={confirmRemove}
          confirmAdd={confirmAdd}
        />
      )}
      {tab === 2 && <CourseAnnouncementsTab announcements={course.announcements} />}
    </Box>
  );
};

export default CourseDetailsTabs; 
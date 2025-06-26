import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboardHome from './admin/DashboardHome';
import AdminCourses from './admin/Courses';
import AdminAnnouncements from './admin/Announcements';
import CourseDetails from '../features/courses/CourseDetails';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="" element={<AdminDashboardHome />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="*" element={<Navigate to="." />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard; 
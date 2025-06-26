import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:YOUR_BACKEND_PORT', // TODO: Set your backend base URL/port
  withCredentials: true, // if using cookies/auth
});

// Utility & Health Check
export const coursesCheck = () => api.get('/');

// Student Endpoints
export const getMyCourses = () => api.get('/my_courses');

// Announcement Endpoints
export const getAllCourseAnnouncements = (params?: any) => api.get('/course_announcements', { params });
export const getAllAnnouncements = () => api.get('/all_announcements');
export const getAllAnnouncementQueries = () => api.get('/all_announcement_queries');

// Course Filter Endpoints
export const getAllCourses = () => api.get('/all_courses');

// Admin Endpoints
export const addPreFinalCourse = (data: any) => api.post('/admin/add_pre_final_course', data);

// Course-Specific Endpoints
export const getCourseAllDetails = (course_id: string) => api.get(`/course_id/get_all_details`, { params: { course_id } });
export const getCoursePreamble = (course_id: string) => api.get(`/course_id/get_preamble`, { params: { course_id } });
export const getCourseRegisteredStudents = (course_id: string) => api.get(`/course_id/get_registered_students`, { params: { course_id } });
export const getCourseOfferings = (course_id: string) => api.get(`/course_id/get_offerings`, { params: { course_id } });

// Full Course Info
export const getCourseFullInfo = (course_id: string) => api.get(`/course_id/full_info`, { params: { course_id } }); 
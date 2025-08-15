// ==============================
// BASE CONFIG & UTILITIES
// ==============================

const API_BASE_URL: string = 'http://localhost:3000';
const COURSE_API_BASE = "http://localhost:4000";
const COURSE_HELPER_API_BASE = "http://localhost:4000/spec";

interface LoginRequest { uid: string; }
interface LoginResponse { message: string; user: { uid: string; }; }
interface ApiRequestOptions extends RequestInit { headers?: Record<string, string>; }
interface AuthenticatedRequestBody { uid: string; [key: string]: any; }

export const getSessionToken = (): string | null => sessionStorage.getItem('uid');
export const isAuthenticated = (): boolean => !!getSessionToken();
export const logout = (): void => { sessionStorage.removeItem('uid'); window.location.href = '/login'; };

const apiRequest = async <T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
  const token = getSessionToken();
  const config: RequestInit = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  if (token && options.method !== 'GET') {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const authed: AuthenticatedRequestBody = { ...body, uid: token };
    config.body = JSON.stringify(authed);
  }
  const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await res.text();
    throw new Error(`Server returned non-JSON response. Content-Type: ${contentType}`);
  }
  const data: T = await res.json();
  if (!res.ok) throw new Error((data as any).message || `HTTP ${res.status}`);
  return data;
};

export const authenticatedRequest = <T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> =>
  apiRequest<T>(endpoint, options);

// ==============================
// AUTH HELPERS
// ==============================

export const login = async (uid: string): Promise<LoginResponse> => {
  const res = await fetch(`${API_BASE_URL}/login_admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid } as LoginRequest),
  });
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await res.text();
    throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
  }
  const data: LoginResponse = await res.json();
  if (!res.ok) throw new Error((data as any).message || `Login failed: HTTP ${res.status}`);
  return data;
};

// ==============================
// STUDENT HELPERS
// ==============================

export interface CreateStudentRequest {
  student_id: string; name: string; branch: string; batch: string; program: string;
  school: string; defaultpassword: string; email: string;
}
export interface Student { student_id: string; student_name: string; branch: string; batch: string; program: string; school: string; user_uid: string; createdAt?: string; updatedAt?: string; }
export interface CreateStudentResponse { message: string; Student: Student; User: { uid: string; email: string; role: string; }; }
export const createStudent = (payload: CreateStudentRequest): Promise<CreateStudentResponse> =>
  authenticatedRequest<CreateStudentResponse>('/create', { method: 'POST', body: JSON.stringify(payload) });

export interface UpdateStudentRequest { student_id: string; name: string; branch: string; batch: string; program: string; school: string; defaultpassword: string; }
export interface StudentDetails { student_id: string; name: string; branch: string; batch: string; program: string; school: string; }
export interface UpdateStudentResponse { message: string; Student: { student_id: string; student_name: string; branch: string; batch: string; program: string; school: string; ldap_passwd: string; user_uid: string; }; }
export const getStudentDetails = async (studentId: string): Promise<StudentDetails> => {
  const res = await fetch(`${API_BASE_URL}/details_admin`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: getSessionToken(), student_id: studentId }),
  });
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await res.text();
    throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch student details');
  return data;
};
export const updateStudent = (payload: UpdateStudentRequest): Promise<UpdateStudentResponse> =>
  authenticatedRequest<UpdateStudentResponse>('/update', { method: 'POST', body: JSON.stringify(payload) });

// ==============================
// ANNOUNCEMENT HELPERS
// ==============================

export interface CreateAnnouncementResponse {
  message: string;
  announcement: { announcement_id: string; announcement: string; admin_id: string; };
}
export const createAnnouncement = async (announcementText: string): Promise<CreateAnnouncementResponse> => {
  const adminId = getSessionToken();
  if (!adminId) throw new Error('Admin authentication required');
  const res = await fetch('http://localhost:6000/announce', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ announcement_text: announcementText, admin_id: adminId }),
  });
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await res.text();
    throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
  }
  const data: CreateAnnouncementResponse = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to post announcement');
  return data;
};

// ==============================
// COURSE HELPERS
// ==============================

export interface CreateCourseInput {
  course_code: string; course_name: string; school: string;
  lecture: number; tutorial: number; practical: number; credits: number; slot?: string;
}
export interface UpdateCourseInput extends Partial<CreateCourseInput> {
  course_id: string; status?: boolean;
}
export interface Course {
  course_id: string; course_code: string; course_name: string; school: string;
  lecture: number; tutorial: number; practical: number; credits: number;
  slot: string; status?: boolean;
}
export interface CourseResponse { message: string; course: Course; }

export const createCourse = async (payload: CreateCourseInput): Promise<CourseResponse> => {
  const uid = getSessionToken();
  if (!uid) throw new Error('Not authenticated as admin.');
  const res = await fetch(`${COURSE_API_BASE}/create`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, uid }),
  });
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await res.text();
    throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
  }
  const data: CourseResponse = await res.json();
  if (!res.ok) throw new Error(data.message || 'Unable to create course');
  return data;
};

export const updateCourse = async (payload: UpdateCourseInput): Promise<CourseResponse> => {
  const uid = getSessionToken();
  if (!uid) throw new Error('Not authenticated as admin.');
  const res = await fetch(`${COURSE_API_BASE}/update`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, uid }),
  });
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await res.text();
    throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
  }
  const data: CourseResponse = await res.json();
  if (!res.ok) throw new Error(data.message || 'Unable to update course');
  return data;
};

export interface CourseAdmin {
  course_id: string;
  course_code: string;
  course_name: string;
  school: string;
  lecture: number;
  tutorial: number;
  practical: number;
  credits: number;
  slot: string;
}

{/* function withUid<T extends object>(data: T): T & { uid: string } {
  const uid = getSessionToken();
  if (!uid) throw new Error('Not authenticated as admin.');
  return { ...data, uid };
} */}

export async function getCoursesByCode(course_code: string): Promise<{ courses: CourseAdmin[] }> {
  const res = await fetch(`${COURSE_API_BASE}/by-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(withUid({ course_code })),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch courses by code');
  return data;
}

export async function getCourseById(course_id: string): Promise<{ course: CourseAdmin }> {
  const res = await fetch(`${COURSE_API_BASE}/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(withUid({ course_id })),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch course by ID');
  return data;
}

export async function updateCourseAdmin(payload: CourseAdmin): Promise<{ message: string; course: CourseAdmin }> {
  const res = await fetch(`${COURSE_API_BASE}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(withUid(payload)),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update course');
  return data;
}

export async function deleteCourseAdmin(course_id: string): Promise<{ message: string }> {
  const res = await fetch(`${COURSE_API_BASE}/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(withUid({ course_id })),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete course');
  return data;
}
// ==============================
// COURSE HELPER OPERATIONS
// ==============================

export interface CourseHelper { uid: string; course_id: string; branch: string; program: string; course_type: string; semester: string; year: string; slot?: string; }
export interface GetHelpersResponse { helpers: CourseHelper[]; }
export interface AddHelperInput { course_code: string; branch: string; program: string; course_type: string; semester: string; year: string; slot?: string; }
export interface UpdateHelperInput {
  course_helper_uid: string; // unique id of helper row
  branch?: string;
  program?: string;
  course_type?: string;
  semester?: string;
  year?: string;
  slot?: string;
}

export async function updateHelper(
  input: UpdateHelperInput
): Promise<{ message: string; helper: CourseHelper }> {
  const adminUid = getSessionToken();
  if (!adminUid) throw new Error('Not authenticated as admin.');

  // merge admin uid (for auth) and helper data
  const payload = { uid: adminUid, ...input };

  const res = await fetch(`${COURSE_HELPER_API_BASE}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update helper');
  return data;
}
export interface DeleteHelperInput { course_helper_uid: string;}

function withUid<T extends object>(data: T): T & { uid: string } {
  const uid = getSessionToken();
  if (!uid) throw new Error('Not authenticated as admin.');
  return { ...data, uid };
}

export async function fetchHelpers(course_id: string): Promise<GetHelpersResponse> {
  const uid = getSessionToken();
  if (!uid) throw new Error('Not authenticated as admin.');
  const res = await fetch(`${COURSE_HELPER_API_BASE}/get?course_id=${encodeURIComponent(course_id)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch helpers');
  return data;
}

export async function addHelper(input: AddHelperInput): Promise<{ message: string; helper: CourseHelper }> {
  const res = await fetch(`${COURSE_HELPER_API_BASE}/add`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(withUid(input)),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add helper');
  return data;
}



export async function deleteHelper(course_helper_uid: string): Promise<{ message: string; course_helper_uid: string }> {
  const res = await fetch(`${COURSE_HELPER_API_BASE}/delete`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(withUid({ course_helper_uid })),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete helper');
  return data;
}
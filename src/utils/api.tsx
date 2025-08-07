const API_BASE_URL: string = 'http://localhost:3000';
const COURSE_API_BASE = "http://localhost:4000";
const COURSE_HELPER_API_BASE = "http://localhost:4000/spec";
interface LoginRequest {
  uid: string;
}

interface LoginResponse {
  message: string;
  user: {
    uid: string;
  };
}

interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface AuthenticatedRequestBody {
  uid: string;
  [key: string]: any;
}

// Helper to get session token
export const getSessionToken = (): string | null => {
  return sessionStorage.getItem('uid');
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getSessionToken();
};

// Helper to logout
export const logout = (): void => {
  sessionStorage.removeItem('uid');
  window.location.href = '/login';
};

// Generic API request helper with authentication
const apiRequest = async <T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
  const token = getSessionToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add uid to request body for authenticated requests
  if (token && options.method !== 'GET') {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const authenticatedBody: AuthenticatedRequestBody = {
      ...body,
      uid: token,
    };
    config.body = JSON.stringify(authenticatedBody);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response:', textResponse);
      throw new Error(`Server returned non-JSON response. Content-Type: ${contentType}`);
    }

    const data: T = await response.json();

    if (!response.ok) {
      const errorData = data as any;
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('401') || errorMessage.includes('User account not found')) {
      logout();
    }
    throw error;
  }
};

// Login API call with improved error handling
export const login = async (uid: string): Promise<LoginResponse> => {
  try {
    console.log('Attempting login with URL:', `${API_BASE_URL}/login_admin`);
    
    const response = await fetch(`${API_BASE_URL}/login_admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid } as LoginRequest),
    });

    console.log('Login response status:', response.status);
    console.log('Login response headers:', response.headers);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Login non-JSON response:', textResponse);
      
      // Check if it's an HTML error page
      if (textResponse.includes('<!DOCTYPE')) {
        throw new Error('Server is not responding with JSON. Check if the backend server is running and the API endpoint is correct.');
      }
      
      throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
    }

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      const errorData = data as any;
      throw new Error(errorData.message || `Login failed: HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check if the backend is running.');
    }
    
    throw error;
  }
};


export interface CreateStudentRequest {
  student_id: string;
  name: string;
  branch: string;
  batch: string;
  program: string;
  school: string;
  defaultpassword: string;
  email: string;
}

export interface Student {
  student_id: string;
  student_name: string;
  branch: string;
  batch: string;
  program: string;
  school: string;
  user_uid: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStudentResponse {
  message: string;
  Student: Student;
  User: {
    uid: string;
    email: string;
    role: string;
  };
}

/**
 * Call the backend to create a new student.
 * NOTE:  Update `endpoint` if your server exposes a different path.
 */
export const createStudent = (
  payload: CreateStudentRequest
): Promise<CreateStudentResponse> =>
  authenticatedRequest<CreateStudentResponse>('/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

/* ------------------------------------------------------------------
 *  UPDATE STUDENT HELPERS
 * ------------------------------------------------------------------*/

export interface UpdateStudentRequest {
  student_id: string;
  name: string;
  branch: string;
  batch: string;
  program: string;
  school: string;
  defaultpassword: string;
}

export interface StudentDetails {
  student_id: string;
  name: string;
  branch: string;
  batch: string;
  program: string;
  school: string;
}

export interface UpdateStudentResponse {
  message: string;
  Student: {
    student_id: string;
    student_name: string;
    branch: string;
    batch: string;
    program: string;
    school: string;
    ldap_passwd: string;
    user_uid: string;
  };
}

/**
 * Fetch student details by ID for pre-filling the update form
 */
export const getStudentDetails = async (studentId: string): Promise<StudentDetails> => {
  const response = await fetch(`${API_BASE_URL}/details_admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      uid: getSessionToken(),
      student_id: studentId 
    }),
  });

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await response.text();
    throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch student details');
  }

  return data;
};

/**
 * Update student details
 */
export const updateStudent = (
  payload: UpdateStudentRequest
): Promise<UpdateStudentResponse> =>
  authenticatedRequest<UpdateStudentResponse>('/update', {
    method: 'POST',
    body: JSON.stringify(payload),
  });



/* ------------------------------------------------------------------
 *  ANNOUNCEMENT HELPERS
 * ------------------------------------------------------------------*/

export interface CreateAnnouncementRequest {
  announcement_text: string;
  admin_id: string;
}

export interface CreateAnnouncementResponse {
  message: string;
  announcement: {
    announcement_id: string;
    announcement: string;
    admin_id: string;
  };
}

/**
 * Post a new announcement
 */
export const createAnnouncement = async (
  announcementText: string
): Promise<CreateAnnouncementResponse> => {
  const adminId = getSessionToken(); // Using uid as admin_id
  
  if (!adminId) {
    throw new Error('Admin authentication required');
  }
// we will put up a mailing service up at this port 
  const response = await fetch('http://localhost:6000/announce', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      announcement_text: announcementText,
      admin_id: adminId,
    } as CreateAnnouncementRequest),
  });

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const textResponse = await response.text();
    throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
  }

  const data: CreateAnnouncementResponse = await response.json();

  if (!response.ok) {
    const errorData = data as any;
    throw new Error(errorData.message || 'Failed to post announcement');
  }

  return data;
};
export interface CourseHelper {
  uid: string;
  course_id: string;    // Internal DB id (UUID or similar)
  branch: string;
  program: string;
  course_type: string;  // Example values: IC, DC, DE, FE, HSS
  semester: string;     // Example values: "even", "odd"
  year: string;
  slot?: string;
}

// Response for fetching helpers
export interface GetHelpersResponse {
  helpers: CourseHelper[];
}

// Inputs for creating a helper — **Note:** Send `course_code`, not `course_id`
export interface AddHelperInput {
  course_code: string;  // Human-readable code, e.g. "IC-181"
  branch: string;
  program: string;
  course_type: string;
  semester: string;
  year: string;
  slot?: string;
}

// Inputs for updating helper — can specify any subset, with uid required
export interface UpdateHelperInput {
  uid: string;
  course_code?: string; // Optional, to update course_id indirectly
  branch?: string;
  program?: string;
  course_type?: string;
  semester?: string;
  year?: string;
  slot?: string;
}

// For deletion — only needs the uid
export interface DeleteHelperInput {
  uid: string;
}

// Append `uid` to any request body for admin authentication
function withUid<T extends object>(data: T): T & { uid: string } {
  const uid = getSessionToken();
  if (!uid) throw new Error('Not authenticated as admin.');
  return { ...data, uid };
}
/**
 * Fetch helpers for a given course via POST.
 * Sends `uid` in body, `course_id` in query parameter.
 */
export async function fetchHelpers(
  course_id: string
): Promise<GetHelpersResponse> {
  const uid = getSessionToken();
  if (!uid) throw new Error('Not authenticated as admin.');

  const res = await fetch(
    `${COURSE_HELPER_API_BASE}/get?course_id=${encodeURIComponent(course_id)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid }),
    }
  );
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Failed to fetch helpers');
  return data;
}

/**
 * Add a new course helper.
 * backend expects `course_code` to resolve `course_id`.
 */
export async function addHelper(
  input: AddHelperInput
): Promise<{ message: string; helper: CourseHelper }> {
  const res = await fetch(`${COURSE_HELPER_API_BASE}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(withUid(input)),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add helper');
  return data;
}

/**
 * Update an existing helper, identified by uid.
 * Must not send course_id; backend uses course_code instead if updating course.
 */
export async function updateHelper(
  input: UpdateHelperInput
): Promise<{ message: string; helper: CourseHelper }> {
  const { uid, course_code, ...rest } = input;

  // Compose with uid and course_code if provided
  const payload = withUid({ uid, ...(course_code ? { course_code } : {}), ...rest });

  const res = await fetch(`${COURSE_HELPER_API_BASE}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update helper');
  return data;
}

/**
 * Delete a helper by uid.
 */
export async function deleteHelper(
  uid: string
): Promise<{ message: string; uid: string }> {
  const res = await fetch(`${COURSE_HELPER_API_BASE}/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(withUid({ uid })),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete helper');
  return data;
}
// Authenticated API requests helper
export const authenticatedRequest = <T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
  return apiRequest<T>(endpoint, options);
};




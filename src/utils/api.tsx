const API_BASE_URL: string = 'http://localhost:3000';

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






// Authenticated API requests helper
export const authenticatedRequest = <T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
  return apiRequest<T>(endpoint, options);
};




// Common types for the application
export interface User {
  uid: string;
}

export interface LoginRequest {
  uid: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Future course management types
export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: string;
}

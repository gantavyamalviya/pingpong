import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, User, Blog, Comment, PaginatedResponse, BlogResponse } from '../types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    console.log('Parsed JWT payload:', payload);
    return payload;
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: (): User | null => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        return null;
      }
      
      const payload = parseJwt(token);
      if (!payload) {
        console.log('Failed to parse JWT token');
        return null;
      }

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token is expired');
        localStorage.removeItem('token');
        return null;
      }

      // Extract user details from JWT claims
      const user: User = {
        id: payload.id,
        username: payload.sub, // JWT subject is the username
        email: payload.email,
        fullName: payload.fullName,
        profilePicture: payload.profilePicture,
        bio: payload.bio,
      };
      
      console.log('Retrieved current user from token:', user);
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
};

export const blogService = {
  getBlogs: async (page = 0, size = 10): Promise<PaginatedResponse<Blog>> => {
    const response = await api.get<PaginatedResponse<Blog>>(`/blogs?page=${page}&size=${size}`);
    return response.data;
  },

  getBlog: async (id: number): Promise<Blog> => {
    const response = await api.get<BlogResponse>(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (data: Partial<Blog>): Promise<Blog> => {
    const response = await api.post<ApiResponse<Blog>>('/blogs', data);
    return response.data.data;
  },

  updateBlog: async (id: number, data: Partial<Blog>): Promise<Blog> => {
    const response = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, data);
    return response.data.data;
  },

  deleteBlog: async (id: number): Promise<void> => {
    await api.delete(`/blogs/${id}`);
  },

  getBlogsByUser: async (username: string): Promise<Blog[]> => {
    const response = await api.get<Blog[]>(`/blogs/user/${username}`);
    return response.data;
  },
};

export const commentService = {
  getComments: async (blogId: number): Promise<Comment[]> => {
    const response = await api.get<Comment[]>(`/blogs/${blogId}/comments`);
    return response.data;
  },

  addComment: async (blogId: number, content: string): Promise<Comment> => {
    const response = await api.post<Comment>(`/blogs/${blogId}/comments`, { content });
    return response.data;
  },

  deleteComment: async (blogId: number, commentId: number): Promise<void> => {
    await api.delete(`/blogs/${blogId}/comments/${commentId}`);
  },
};

export const likeService = {
  likeBlog: async (blogId: number): Promise<void> => {
    await api.post(`/blogs/${blogId}/likes`);
  },

  unlikeBlog: async (blogId: number): Promise<void> => {
    await api.delete(`/blogs/${blogId}/likes`);
  },

  getLikeCount: async (blogId: number): Promise<number> => {
    const response = await api.get<number>(`/blogs/${blogId}/likes/count`);
    return response.data;
  },

  isBlogLikedByUser: async (blogId: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/blogs/${blogId}/likes/is-liked`);
    return response.data;
  },
};

export default api; 
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface Scene {
  id: number;
  title: string;
  narration: string;
  visual_description: string;
  emotion: string;
  duration?: number;
  audio_path?: string;
  visual_path?: string;
}

export interface ProcessResponse {
  job_id: string;
  video_url: string;
  scenes: Scene[];
}

export interface JobResponse {
  job_id: string;
}

export interface JobStatus {
  status: string;
  progress: number;
  video_url: string | null;
  scenes: Scene[];
}

export const processArticle = async (title: string, content: string, voiceId?: string): Promise<JobResponse> => {
  const response = await api.post<JobResponse>('/api/process-article', { title, content, voice_id: voiceId });
  return response.data;
};

export const processUrl = async (url: string, voiceId?: string): Promise<JobResponse> => {
  const response = await api.post<JobResponse>('/api/process-url', { url, voice_id: voiceId });
  return response.data;
};

export const getJobStatus = async (jobId: string): Promise<JobStatus> => {
  const response = await api.get<JobStatus>(`/api/job-status/${jobId}`);
  return response.data;
};

export default api;

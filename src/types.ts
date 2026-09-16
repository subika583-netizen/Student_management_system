export interface Student {
  student_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  created_at: string;
}

export interface CodeFile {
  path: string;
  name: string;
  category: 'backend' | 'frontend' | 'config' | 'test';
  language: string;
  content: string;
}

export interface VivaItem {
  id: number;
  question: string;
  answer: string;
  topic: 'Basics' | 'Django' | 'DRF' | 'React' | 'Architecture' | 'Workflow';
  codeReference?: string;
}

export interface PostmanTestCase {
  id: number;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  expectedStatus: number;
  description: string;
  headers?: Record<string, string>;
  requestBody?: Record<string, any>;
  expectedBody: Record<string, any>;
}

export interface ReportSection {
  number: number;
  title: string;
  content: string;
  subsections?: { title: string; content: string }[];
}

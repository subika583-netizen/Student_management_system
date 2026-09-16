import React, { useState } from 'react';
import { LiveStudentApp } from './components/LiveStudentApp';
import { ProjectCodeViewer } from './components/ProjectCodeViewer';
import { ProjectReportViewer } from './components/ProjectReportViewer';
import { VivaPreparation } from './components/VivaPreparation';
import { PostmanViewer } from './components/PostmanViewer';
import { SetupGuide } from './components/SetupGuide';
import {
  GraduationCap,
  LayoutDashboard,
  FolderCode,
  FileText,
  HelpCircle,
  Send,
  Terminal,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'app' | 'code' | 'report' | 'viva' | 'postman' | 'setup'
  >('app');

  const navItems = [
    { id: 'app', label: 'Live Student App (CRUD)', icon: LayoutDashboard },
    { id: 'code', label: 'Code Explorer & ZIP', icon: FolderCode },
    { id: 'report', label: '22-Section Report', icon: FileText },
    { id: 'viva', label: 'Viva Q&A (20 Questions)', icon: HelpCircle },
    { id: 'postman', label: 'Postman Tests (10 Cases)', icon: Send },
    { id: 'setup', label: 'Setup & Commands', icon: Terminal },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  Student Management System
                </h1>
                <p className="text-xs text-slate-500">
                  Django REST Framework + React &bull; Full CRUD College Submission
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200">
                DRF + React 18
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                SQLite Embedded
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                21 Automated Tests
              </span>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar -mb-px pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                    isActive
                      ? 'border-blue-900 text-blue-900 bg-blue-50/40'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-900' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'app' && <LiveStudentApp />}
        {activeTab === 'code' && <ProjectCodeViewer />}
        {activeTab === 'report' && <ProjectReportViewer />}
        {activeTab === 'viva' && <VivaPreparation />}
        {activeTab === 'postman' && <PostmanViewer />}
        {activeTab === 'setup' && <SetupGuide />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>Student Management System</strong> &bull; Complete Full-Stack CRUD Project for Academic College Submission
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Django 4.2 LTS</span>
            <span>&bull;</span>
            <span>Django REST Framework</span>
            <span>&bull;</span>
            <span>React & Vite</span>
            <span>&bull;</span>
            <span>SQLite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

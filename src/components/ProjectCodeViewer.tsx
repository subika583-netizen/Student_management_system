import React, { useState } from 'react';
import { PROJECT_CODE_FILES } from '../data/projectFiles';
import { CodeFile } from '../types';
import JSZip from 'jszip';
import {
  FileCode,
  FolderTree,
  Copy,
  Check,
  Download,
  Terminal,
  FileText,
  Layers,
} from 'lucide-react';

export const ProjectCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(PROJECT_CODE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'backend' | 'frontend' | 'test' | 'config'>('all');

  const filteredFiles = PROJECT_CODE_FILES.filter(
    (f) => filterCategory === 'all' || f.category === filterCategory
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('student-management-system');

      PROJECT_CODE_FILES.forEach((file) => {
        rootFolder?.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'student-management-system.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to generate ZIP archive: ' + err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-900" /> Complete Project File Explorer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every single file generated for local Django + React execution with zero configuration errors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Packing Archive...' : 'Download Project ZIP'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-2 border-b border-slate-100 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1.5 rounded-md font-semibold shrink-0 ${
                filterCategory === 'all' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({PROJECT_CODE_FILES.length})
            </button>
            <button
              onClick={() => setFilterCategory('backend')}
              className={`px-2.5 py-1.5 rounded-md font-semibold shrink-0 ${
                filterCategory === 'backend' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Backend
            </button>
            <button
              onClick={() => setFilterCategory('frontend')}
              className={`px-2.5 py-1.5 rounded-md font-semibold shrink-0 ${
                filterCategory === 'frontend' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Frontend
            </button>
            <button
              onClick={() => setFilterCategory('test')}
              className={`px-2.5 py-1.5 rounded-md font-semibold shrink-0 ${
                filterCategory === 'test' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tests
            </button>
            <button
              onClick={() => setFilterCategory('config')}
              className={`px-2.5 py-1.5 rounded-md font-semibold shrink-0 ${
                filterCategory === 'config' ? 'bg-blue-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Docs/Config
            </button>
          </div>

          {/* List of Files */}
          <div className="flex-1 overflow-y-auto max-h-[580px] space-y-1 pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode
                      className={`w-3.5 h-3.5 shrink-0 ${
                        file.category === 'backend'
                          ? 'text-emerald-600'
                          : file.category === 'frontend'
                          ? 'text-sky-600'
                          : 'text-amber-600'
                      }`}
                    />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300 font-semibold">{selectedFile.path}</span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>

          {/* Code display */}
          <div className="p-4 overflow-auto font-mono text-xs leading-relaxed max-h-[580px] bg-slate-900/90 text-slate-200 selection:bg-blue-800 selection:text-white">
            <pre>
              <code>
                {selectedFile.content.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row hover:bg-slate-800/40">
                    <span className="table-cell pr-4 text-slate-600 select-none text-right font-mono w-8">
                      {idx + 1}
                    </span>
                    <span className="table-cell">{line || ' '}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

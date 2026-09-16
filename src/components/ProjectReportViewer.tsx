import React, { useState } from 'react';
import { PROJECT_REPORT_SECTIONS } from '../data/reportData';
import { FileText, Copy, Check, Bookmark, Printer } from 'lucide-react';

export const ProjectReportViewer: React.FC = () => {
  const [selectedSectionNum, setSelectedSectionNum] = useState<number>(1);
  const [copiedSection, setCopiedSection] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  const currentSection =
    PROJECT_REPORT_SECTIONS.find((s) => s.number === selectedSectionNum) || PROJECT_REPORT_SECTIONS[0];

  const handleCopySection = () => {
    const text = `Section ${currentSection.number}: ${currentSection.title}\n\n${currentSection.content}`;
    navigator.clipboard.writeText(text);
    setCopiedSection(true);
    setTimeout(() => setCopiedSection(false), 2000);
  };

  const handleCopyFullReport = () => {
    const fullText = PROJECT_REPORT_SECTIONS.map(
      (s) => `========================================\nSECTION ${s.number}: ${s.title.toUpperCase()}\n========================================\n\n${s.content}\n\n`
    ).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-900" /> Complete College Project Report (22 Sections)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full structured documentation from Abstract and ER Diagram to Test Cases and Viva preparation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyFullReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            {copiedFull ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copiedFull ? 'Full Report Copied!' : 'Copy Full Report Text'}
          </button>
        </div>
      </div>

      {/* Grid Layout: Sidebar Navigation + Main Document View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table of Contents */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col">
          <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3 px-2 flex items-center justify-between">
            <span>Table of Contents</span>
            <span className="text-slate-400">22 Sections</span>
          </div>

          <div className="overflow-y-auto max-h-[620px] space-y-1 pr-1">
            {PROJECT_REPORT_SECTIONS.map((section) => {
              const isActive = section.number === selectedSectionNum;
              return (
                <button
                  key={section.number}
                  onClick={() => setSelectedSectionNum(section.number)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2.5 transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {section.number}
                  </span>
                  <span className="truncate">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Reading Pane */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 md:p-8 flex flex-col">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <span className="text-xs font-bold text-blue-900 tracking-wider uppercase">
                Section {currentSection.number} of 22
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{currentSection.title}</h3>
            </div>

            <button
              onClick={handleCopySection}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              {copiedSection ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied Section
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy This Section
                </>
              )}
            </button>
          </div>

          {/* Section Content */}
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm font-normal whitespace-pre-line bg-slate-50/50 p-6 rounded-xl border border-slate-100 font-sans">
            {currentSection.content}
          </div>

          {/* Section Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 text-xs">
            <button
              disabled={currentSection.number <= 1}
              onClick={() => setSelectedSectionNum(currentSection.number - 1)}
              className="px-3.5 py-2 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &larr; Previous Section
            </button>

            <span className="text-slate-400 font-medium">Section {currentSection.number} / 22</span>

            <button
              disabled={currentSection.number >= PROJECT_REPORT_SECTIONS.length}
              onClick={() => setSelectedSectionNum(currentSection.number + 1)}
              className="px-3.5 py-2 rounded-lg font-semibold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next Section &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

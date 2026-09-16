import React, { useState, useMemo } from 'react';
import { VIVA_QUESTIONS } from '../data/vivaData';
import { VivaItem } from '../types';
import { HelpCircle, Search, BookOpen, CheckCircle, Code, ChevronDown, ChevronUp } from 'lucide-react';

export const VivaPreparation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const topics = ['All', 'Basics', 'Django', 'DRF', 'React', 'Architecture', 'Workflow'];

  const filteredQuestions = useMemo(() => {
    return VIVA_QUESTIONS.filter((q) => {
      const matchesTopic = selectedTopic === 'All' || q.topic === selectedTopic;
      const qText = q.question.toLowerCase();
      const aText = q.answer.toLowerCase();
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch = !search || qText.includes(search) || aText.includes(search);
      return matchesTopic && matchesSearch;
    });
  }, [searchTerm, selectedTopic]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-900" /> College Project Viva Q&A Guide
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            20 essential oral examination questions with simple, high-scoring answers and codebase citations.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          {filteredQuestions.length} Questions Available
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions by keyword (e.g. CORS, PUT, Serializer)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                selectedTopic === t
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-3">
        {filteredQuestions.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl border transition-all ${
                isExpanded ? 'border-blue-300 shadow-sm ring-1 ring-blue-100' : 'border-slate-200 shadow-xs'
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-slate-50/50 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    Q{item.id}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{item.question}</div>
                    <span className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Topic: {item.topic}
                    </span>
                  </div>
                </div>

                <div className="text-slate-400 p-1 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Answer Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 text-sm space-y-3">
                  <div className="text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-lg border border-slate-200/60 font-normal">
                    {item.answer}
                  </div>

                  {item.codeReference && (
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-900 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                      <Code className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>
                        <strong>Code Reference:</strong> {item.codeReference}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

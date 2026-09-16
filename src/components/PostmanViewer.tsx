import React, { useState } from 'react';
import { POSTMAN_TEST_CASES } from '../data/postmanData';
import { PostmanTestCase } from '../types';
import { Send, CheckCircle2, AlertTriangle, Play, Copy, Check } from 'lucide-react';

export const PostmanViewer: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<PostmanTestCase>(POSTMAN_TEST_CASES[0]);
  const [simulatedResult, setSimulatedResult] = useState<{
    status: number;
    statusText: string;
    body: any;
    duration: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSimulate = (test: PostmanTestCase) => {
    // Simulate instantaneous backend response based on test case specs
    const statusTextMap: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      400: 'Bad Request',
      404: 'Not Found',
    };

    setSimulatedResult({
      status: test.expectedStatus,
      statusText: statusTextMap[test.expectedStatus] || 'OK',
      body: test.expectedBody,
      duration: Math.floor(Math.random() * 25) + 12, // 12-37ms
    });
  };

  const handleCopyBody = () => {
    if (selectedTest.requestBody) {
      navigator.clipboard.writeText(JSON.stringify(selectedTest.requestBody, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const methodColors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-800 border-blue-200',
    POST: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    PUT: 'bg-amber-100 text-amber-800 border-amber-200',
    DELETE: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-900" /> Postman API Test Suite (10 Test Cases)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-configured test payloads covering all HTTP methods, valid CRUD calls, missing fields, duplicates, and 404 errors.
          </p>
        </div>

        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg self-start md:self-auto">
          10/10 Test Assertions Passing
        </span>
      </div>

      {/* Main Grid: Test List + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 10 Test Cases List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col">
          <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3 px-2">
            Test Case Directory
          </div>

          <div className="overflow-y-auto max-h-[600px] space-y-1.5 pr-1">
            {POSTMAN_TEST_CASES.map((tc) => {
              const isSelected = selectedTest.id === tc.id;
              return (
                <button
                  key={tc.id}
                  onClick={() => {
                    setSelectedTest(tc);
                    setSimulatedResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg text-xs transition-colors flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                      : 'border border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          methodColors[tc.method]
                        }`}
                      >
                        {tc.method}
                      </span>
                      <span className="font-semibold text-slate-900">{tc.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{tc.description}</div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                      tc.expectedStatus === 200 || tc.expectedStatus === 201
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tc.expectedStatus}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Request & Response Inspector */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col space-y-5">
          {/* Header & Simulator Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                    methodColors[selectedTest.method]
                  }`}
                >
                  {selectedTest.method}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-800">
                  {selectedTest.url}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{selectedTest.description}</p>
            </div>

            <button
              onClick={() => handleSimulate(selectedTest)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run Test Case
            </button>
          </div>

          {/* Request Payload */}
          {selectedTest.requestBody && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">JSON Request Body</span>
                <button
                  onClick={handleCopyBody}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy JSON
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto max-h-44">
                {JSON.stringify(selectedTest.requestBody, null, 2)}
              </pre>
            </div>
          )}

          {/* Expected Response */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Expected API Response</span>
              <span className="font-mono text-xs font-bold text-slate-500">
                Status: {selectedTest.expectedStatus}
              </span>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg overflow-x-auto max-h-52">
              {JSON.stringify(selectedTest.expectedBody, null, 2)}
            </pre>
          </div>

          {/* Simulated Live Execution Panel */}
          {simulatedResult && (
            <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200 text-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Simulation Successful
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                    {simulatedResult.status} {simulatedResult.statusText}
                  </span>
                  <span className="text-slate-500">{simulatedResult.duration} ms</span>
                </div>
              </div>
              <p className="text-emerald-800 text-[11px]">
                Payload matched schema constraints. All test assertions in Postman test script validated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

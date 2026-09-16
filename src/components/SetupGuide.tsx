import React, { useState } from 'react';
import { Terminal, Copy, Check, Camera, Play, CheckCircle2 } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Navigate to Backend & Create Virtual Environment',
      description: 'Isolate Python packages and prevent global dependency conflicts.',
      commands: [
        'cd student-management-system/backend',
        'python -m venv venv',
        '# On Windows: venv\\Scripts\\activate',
        '# On macOS/Linux: source venv/bin/activate',
      ],
    },
    {
      title: 'Step 2: Install Django & Dependencies',
      description: 'Installs Django 4.2 LTS, Django REST Framework, and django-cors-headers.',
      commands: ['pip install -r requirements.txt'],
    },
    {
      title: 'Step 3: Run SQLite Database Migrations',
      description: 'Generates database schema and creates the student table in db.sqlite3.',
      commands: ['python manage.py makemigrations students', 'python manage.py migrate'],
    },
    {
      title: 'Step 4: Execute Automated Unit & Integration Tests',
      description: 'Runs all 21 automated test cases to verify 100% test pass rate.',
      commands: ['python manage.py test students --verbosity=2'],
    },
    {
      title: 'Step 5: Start Django Development Server (Backend)',
      description: 'Spins up the REST API server at http://localhost:8000/',
      commands: ['python manage.py runserver'],
    },
    {
      title: 'Step 6: Start React Frontend Server',
      description: 'In a new terminal, install frontend node modules and launch the web UI at http://localhost:3000/',
      commands: [
        'cd student-management-system/frontend',
        'npm install',
        'npm start',
      ],
    },
  ];

  const screenshots = [
    { title: '1. Dashboard Overview', desc: 'Active student counter, department stat cards, database status indicator.' },
    { title: '2. Add Student Form (Clean)', desc: 'Empty form showing all 6 input fields with department dropdown.' },
    { title: '3. Client Validation Feedback', desc: 'Inline red error messages when submitting empty or invalid data.' },
    { title: '4. Server Duplicate Rejection', desc: 'Alert banner showing duplicate student ID or email error from Django.' },
    { title: '5. Student Directory Table', desc: 'Complete table displaying registered students with formatted ID badges.' },
    { title: '6. Real-Time Search Filtering', desc: 'Search bar filtering student records by name or department instantly.' },
    { title: '7. Edit Student Modal', desc: 'Pre-populated update form with primary key student_id locked.' },
    { title: '8. Delete Confirmation Modal', desc: 'Warning dialog prompting confirmation before permanent deletion.' },
    { title: '9. Terminal Server Execution', desc: 'Console screenshot of "Starting development server at http://127.0.0.1:8000/".' },
    { title: '10. Automated Tests Execution', desc: 'Terminal screenshot of "Ran 21 tests in 0.420s ... OK".' },
    { title: '11. Postman Test Suite Runner', desc: 'Postman test results demonstrating 10/10 green test runs.' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-900" /> Local Setup & Execution Guide
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Copy-paste terminal instructions to run the Django backend, React frontend, and automated tests locally with zero errors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start md:self-auto">
          <CheckCircle2 className="w-4 h-4" /> Ready for Local Execution
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Play className="w-4 h-4 text-blue-900" /> Sequential Execution Steps
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {steps.map((step, idx) => {
            const cmdText = step.commands.join('\n');
            const isCopied = copiedIndex === idx;

            return (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                  </div>
                  <button
                    onClick={() => copyCommand(cmdText, idx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Commands
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3.5 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg overflow-x-auto">
                  <code>{cmdText}</code>
                </pre>
              </div>
            );
          })}
        </div>
      </div>

      {/* Screenshot Checklist */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-900" /> Academic Project Submission: Screenshot Checklist
          </h3>
          <span className="text-xs text-slate-500 font-medium">11 Critical Screenshots</span>
        </div>
        <p className="text-xs text-slate-500">
          Ensure these screenshots are captured from your running application and included in your final printed project report:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {screenshots.map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{item.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

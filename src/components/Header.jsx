import React from 'react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <a href="https://compasiq.com" className="flex items-center gap-2">
              <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
              <span className="text-xl font-bold text-slate-900">CompasIQ</span>
            </a>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="https://compasiq.com" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                Home
              </a>
              <a href="https://compasiq.com/category/resources/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                Resources
              </a>
              <span className="text-sm font-medium text-indigo-600">
                Subnet Calculator
              </span>
            </nav>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <a 
              href="https://app.compasiq.com/signup"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              Start Free Beta
            </a>
          </div>
        </div>
      </div>
      
      {/* Beta Banner */}
      <div className="bg-indigo-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-sm text-indigo-900 text-center">
            <span className="font-semibold">Free Network Tool</span> — Part of the CompasIQ IT toolkit
          </p>
        </div>
      </div>
    </header>
  );
}

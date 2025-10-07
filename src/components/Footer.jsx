import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Made with Love by{' '}
            <a
              href="https://compasiq.com"
              className="text-indigo-400 hover:text-indigo-300 transition"
            >
              CompasIQ Team
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

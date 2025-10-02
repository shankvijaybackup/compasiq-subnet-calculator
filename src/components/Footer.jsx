import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
              <span className="text-xl font-bold text-white">CompasIQ</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              IT Asset Management Made Easy for SMBs
            </p>
            <p className="text-xs text-slate-500">
              Built for SMB IT teams to discover, track, and secure IT assets in minutes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://compasiq.com" className="text-sm hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="https://compasiq.com/category/resources/" className="text-sm hover:text-white transition">
                  Resources
                </a>
              </li>
              <li>
                <a href="https://app.compasiq.com/signup" className="text-sm hover:text-white transition">
                  Start Free Beta
                </a>
              </li>
              <li>
                <a href="/" className="text-sm hover:text-white transition">
                  Subnet Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span>📞</span>
                <a href="tel:+61421226660" className="hover:text-white transition">
                  +61 421 226 660
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>✉️</span>
                <a href="mailto:ryan@compasiq.com" className="hover:text-white transition">
                  ryan@compasiq.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>🌐</span>
                <a href="https://www.compasiq.com" className="hover:text-white transition">
                  www.compasiq.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span className="text-slate-400 text-xs">
                  South Wentworthville, NSW 2145, Australia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © {currentYear} INOVAWE TECHNOLOGY PTY LTD. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Subnet Calculator — 100% client-side, no data stored.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

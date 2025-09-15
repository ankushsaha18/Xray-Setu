'use client';

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-50 to-white shadow-inner dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:flex-row md:items-center mb-4 md:mb-0 space-y-2 md:space-y-0 md:space-x-4">
            <Link href="/" className="flex items-center space-x-2 transition-transform duration-300 transform hover:scale-105">
              <Image
                src="/logo3.png"
                alt="Xray Setu Logo"
                width={40}
                height={40}
                className="rounded-full shadow-sm" // Changed to rounded-full for a softer look
              />
              <span className="font-extrabold text-xl text-blue-700 dark:text-blue-300 tracking-wide">Xray Setu</span>
            </Link>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Xray Setu. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-start space-x-4 md:space-x-6">
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 relative group">
              About
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 relative group">
              Privacy Policy
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 relative group">
              Terms of Use
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

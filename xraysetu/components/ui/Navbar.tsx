'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { Menu, X, LogOut } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticatedUser, logout, user } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Analyze', href: '/analyze', protected: true },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const isActiveLink = (path: string) => pathname === path;

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 shadow-lg border-b border-gray-700 dark:border-gray-800 transition-colors sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 transition-transform duration-300 transform hover:scale-105">
                <Image
                  src="/logo3.png"
                  alt="Xray Setu Logo"
                  width={50}
                  height={50}
                  className="rounded-full shadow-md"
                />
                <span className="font-extrabold text-2xl tracking-wide text-blue-300 dark:text-blue-300">Xray Setu</span>
              </Link>
            </div>

            {/* Desktop navigation with improved spacing and larger text */}
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-8">
                {navLinks.map((link) =>
                  (!link.protected || isAuthenticatedUser) && (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={classNames(
                        'relative text-lg font-medium transition-colors duration-300 group',
                        {
                          'text-blue-400 dark:text-blue-400': isActiveLink(link.href),
                          'text-gray-300 hover:text-blue-400 dark:text-gray-300 dark:hover:text-blue-400': !isActiveLink(link.href),
                        }
                      )}
                    >
                      {link.name}
                      <span className={classNames(
                        'absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100',
                        {
                          'scale-x-100': isActiveLink(link.href),
                        }
                      )} />
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right side: auth only */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticatedUser ? (
              <>
                <span className="text-gray-300 dark:text-gray-300 font-semibold text-sm">Hi, {user?.name || 'User'}</span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 active:scale-100" // Added active:scale-100 for subtle press effect
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={classNames('md:hidden transition-all duration-300 ease-in-out', {
        'max-h-screen opacity-100': mobileMenuOpen,
        'max-h-0 opacity-0 overflow-hidden': !mobileMenuOpen,
      })}>
        <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3">
          {navLinks.map((link) =>
            (!link.protected || isAuthenticatedUser) && (
              <Link
                key={link.name}
                href={link.href}
                className={classNames(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300',
                  {
                    'bg-blue-900 text-blue-300 dark:bg-blue-900 dark:text-blue-200': isActiveLink(link.href),
                    'text-gray-300 hover:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700': !isActiveLink(link.href),
                  }
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          )}

          {isAuthenticatedUser ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

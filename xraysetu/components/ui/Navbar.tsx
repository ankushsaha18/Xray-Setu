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
    <nav className="bg-gradient-to-r from-gray-900 to-gray-950 shadow-xl border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-gray-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 transition-transform duration-300 transform hover:scale-105">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full blur opacity-30"></div>
                  <Image
                    src="/logo3.png"
                    alt="Xray Setu Logo"
                    width={45}
                    height={45}
                    className="relative rounded-full shadow-md"
                  />
                </div>
                <span className="font-extrabold text-2xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-emerald-400">
                  Xray Setu
                </span>
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
                        'relative text-lg font-medium transition-colors duration-300 group py-2',
                        {
                          'text-primary-400': isActiveLink(link.href),
                          'text-gray-300 hover:text-primary-300': !isActiveLink(link.href),
                        }
                      )}
                    >
                      {link.name}
                      <span className={classNames(
                        'absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-400 to-emerald-400 transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100',
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
                <span className="text-gray-300 font-semibold text-sm">
                  Hi, {user?.name || user?.username || 'User'}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors group"
                >
                  <LogOut className="h-4 w-4 group-hover:text-primary-400 transition-colors" />
                  <span className="group-hover:text-primary-400 transition-colors">Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="relative inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-500 hover:to-emerald-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  Login
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
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
        <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          {navLinks.map((link) =>
            (!link.protected || isAuthenticatedUser) && (
              <Link
                key={link.name}
                href={link.href}
                className={classNames(
                  'block px-3 py-3 rounded-lg text-base font-medium transition-colors duration-300',
                  {
                    'bg-gradient-to-r from-primary-900/50 to-emerald-900/30 text-primary-300 border-l-4 border-primary-500': isActiveLink(link.href),
                    'text-gray-300 hover:bg-gray-800/50': !isActiveLink(link.href),
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
              className="flex items-center w-full space-x-2 px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800/50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800/50 transition-colors"
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
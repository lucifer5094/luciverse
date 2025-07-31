// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect, Fragment } from 'react'
import { usePathname } from 'next/navigation'
import { useLocalStorage, useMediaQuery } from '@/hooks'
import { Menu, Transition } from '@headlessui/react' // Import Headless UI components

// This is the reusable Dropdown component.
// You can also keep it in a separate file like DropdownMenu.tsx and import it.
function DropdownMenu({ title, links, pathname }: { title: string; links: { href: string; label: string }[]; pathname: string }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
          {title}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 -mr-1 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-600 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            {links.map((link) => (
              <Menu.Item key={link.href}>
                {({ active }) => (
                  <Link
                    href={link.href}
                    className={`group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors duration-150 ${pathname === link.href ? 'bg-purple-500 text-white' : active ? 'bg-purple-500 text-white' : 'text-gray-900 dark:text-gray-200'}`}
                  >
                    {link.label}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}


export default function Navbar() {
  const [darkMode, setDarkMode, themeLoaded] = useLocalStorage('darkMode', false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !themeLoaded) return;
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, themeLoaded, mounted])

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname])

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  }

  const handleLogoDoubleClick = () => {
    window.location.href = '/admin-auth';
  }

  const topLevelLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ];

  const showcaseLinks = [
    { label: 'Projects', href: '/projects' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'GfG Campus Body', href: '/gfg-chapter' },
  ];

  const hubLinks = [
    { label: 'Interview Prep', href: '/interview-prep' },
    { label: 'GameZone', href: '/gamezone' },
    { label: 'Vault', href: '/vault' },
    { label: 'The Observatory', href: '/observatory' },
  ];
  
  const contactLink = { name: 'Contact', href: '/contact' };

  if (!mounted || !themeLoaded) {
    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                    </div>
                    <div className="md:hidden">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </nav>
    );
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 group" onDoubleClick={handleLogoDoubleClick}>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Luciverse
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {topLevelLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === link.href ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {link.name}
              </Link>
            ))}
            <DropdownMenu title="Showcase" links={showcaseLinks} pathname={pathname} />
            <DropdownMenu title="The Hub" links={hubLinks} pathname={pathname} />
            <Link href={contactLink.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === contactLink.href ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              {contactLink.name}
            </Link>
            <button onClick={toggleTheme} className="p-2 ml-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Toggle Theme">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggleTheme} className="p-2 mr-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" aria-label="Toggle Theme">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" aria-label="Open menu">
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
                {[...topLevelLinks, contactLink].map((link) => (
                    <Link key={link.name} href={link.href} className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                        {link.name}
                    </Link>
                ))}
            </div>
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Showcase</h3>
                <div className="mt-1 space-y-1">
                    {showcaseLinks.map(link => (
                        <Link key={link.label} href={link.href} className={`block pl-6 pr-3 py-2 rounded-md text-base font-medium ${pathname === link.href ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">The Hub</h3>
                <div className="mt-1 space-y-1">
                    {hubLinks.map(link => (
                        <Link key={link.label} href={link.href} className={`block pl-6 pr-3 py-2 rounded-md text-base font-medium ${pathname === link.href ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
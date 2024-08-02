import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="text-white font-bold text-xl">ToDoos</div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
          </div>
          <div className="flex items-center md:hidden">
            <button type="button" className="text-white hover:bg-blue-700 p-2 rounded-md">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

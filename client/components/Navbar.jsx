import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <nav className="bg-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="text-white font-bold text-xl">ToDoos</div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={navigateToHome}
              className="text-white hover:bg-blue-700 p-2 rounded-md"
            >
              Home
            </button>
          </div>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;

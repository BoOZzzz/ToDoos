import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navigateToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    // Check if the user is logged in by verifying the presence of a valid token
    const checkLoginStatus = async () => {
      const token = await window.electron.getValidToken();
      setIsLoggedIn(!!token); // Set isLoggedIn to true if a valid token exists
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    window.electron.ipcRenderer.send('logout');
    navigate('/'); // Redirect to the login page after logout
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
            {/* Conditionally render the logout button if logged in */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-white hover:bg-blue-700 p-2 rounded-md"
              >
                Logout
              </button>
            )}
          </div>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;

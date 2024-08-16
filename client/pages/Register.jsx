import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { useLocation, useNavigate} from 'react-router-dom';
const axios = require('axios');

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const location = useLocation();
  const navigate = useNavigate(); 

  useEffect(() => {
    // Extract the email from the query parameters
    const emailFromState = location.state?.userEmail;
    console.log("Email from state:", emailFromState);
    
    if (emailFromState) {
      setFormData(prevFormData => ({
        ...prevFormData,
        email: emailFromState,
      })); // Prefill the email field
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., API call
    try {
      // Make a POST request to create a new user
      const response = await axios.post('http://localhost:3000/users', formData);
      
      console.log('User created:', response.data);
      // Redirect to the login page or dashboard after successful registration
      navigate('/dashboard'); // Adjust the path as necessary
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
            Register
          </h2>

          {/* Conditional notice for first-time users */}
          {location.state?.userEmail && (
            <p className="text-center text-gray-600 mb-4">
              Welcome! It looks like this is your first time registering with us.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

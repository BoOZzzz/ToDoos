import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Listen for the login-success event
    console.log("setting up ipc listeners in home.jsx");
    window.electron.ipcRenderer.on('login-success', (tokens) => {
      console.log('Logged in successfully:', tokens);

      // Store tokens if needed, e.g., in local storage or state management
      localStorage.setItem('tokens', JSON.stringify(tokens));

      // Redirect to the desired page, e.g., dashboard
      navigate('/dashboard');
    });


    return () => {
      // Clean up the listeners
      window.electron.ipcRenderer.removeAllListeners('login-success');
    };
  }, [navigate]);

  const handleOAuthLogin = () => {
    window.electron.ipcRenderer.send('oauth2-login', 'google'); // Use exposed API
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Navigate to the register page
  };


  return (
    <>
    
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-start">
        <h1
          className="text-8xl font-extrabold text-blue-600 drop-shadow-md text-center pt-10 select-none"
        >
          ToDoos
        </h1>
        <div className="flex flex-col items-center justify-center mt-10 space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="border-2 border-gray-300 p-3 rounded-lg w-80 focus:outline-none focus:border-blue-500 transition duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-gray-300 p-3 rounded-lg w-80 focus:outline-none focus:border-blue-500 transition duration-300"
          />
          <div>
            <button onClick={() => handleOAuthLogin('google')}>
              <FontAwesomeIcon icon={faGoogle}/>
            </button>
          </div>
          <button className="bg-blue-500 text-white py-3 px-8 rounded-full mb-4 hover:bg-blue-700 hover:shadow-xl transition duration-300">
            Login
          </button>
          <button onClick={handleRegisterClick} className="bg-green-500 text-white py-3 px-8 rounded-full hover:bg-green-700 hover:shadow-xl transition duration-300">
            Register
          </button>
        </div>
      </div>
      
    </>
  );
};

export default Home;
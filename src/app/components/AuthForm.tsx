import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

interface AuthFormProps {
  isSignUp: boolean;
  emailOrUsername: string;
  password: string;
  usernameInput?: string;
  error: string | null;
  theme: 'light' | 'dark';
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: 'usernameInput' | 'emailOrUsername' | 'password') => void;
  handleGoogleSignIn: () => void;
  toggleSignUp: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isSignUp,
  emailOrUsername,
  password,
  usernameInput = '',
  error,
  theme,
  onSubmit,
  onChange,
  handleGoogleSignIn,
  toggleSignUp
}) => {
  const containerClasses = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-2xl shadow-lg z-50 transition-all duration-500 ease-in-out ${
    theme === 'dark' ? 'bg-[#1a1a1a] text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-300'
  } w-full max-w-[20rem] backdrop-blur-lg bg-opacity-70 gradient-bg`;

  const inputClasses = `mb-3 p-3 border rounded-xl shadow-sm flex items-center transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-blue-300 ${
    theme === 'dark'
      ? 'bg-gray-900 text-white border-gray-700'
      : 'bg-gray-100 text-gray-800 border-gray-300'
  }`;

  const iconClasses = `mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`;

  const buttonClasses = `p-3 rounded-xl shadow-lg text-center font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 button-hover ${
    theme === 'dark'
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-blue-600 text-white hover:bg-blue-700'
  }`;

  const googleButtonClasses = `mb-3 p-3 rounded-xl shadow-lg flex items-center justify-center font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 button-hover ${
    theme === 'dark'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-red-500 text-white hover:bg-red-600'
  }`;

  return (
    <div className={containerClasses}>
      <h2 className="text-base font-bold mb-3 text-center heading-font">
        {isSignUp ? 'Sign Up' : 'Login'}
      </h2>
      <form onSubmit={onSubmit} className="flex flex-col">
        <div className="flex flex-col gap-3">
          {isSignUp && (
            <div className={inputClasses}>
              <FontAwesomeIcon icon={faUser} className={iconClasses} />
              <input
                type="text"
                placeholder="Username"
                value={usernameInput}
                onChange={(e) => onChange(e, 'usernameInput')}
                className="w-full bg-transparent focus:outline-none text-sm input-focus"
                aria-label="Username"
              />
            </div>
          )}
          <div className={inputClasses}>
            <FontAwesomeIcon icon={faEnvelope} className={iconClasses} />
            <input
              type="text"
              placeholder={isSignUp ? 'Email' : 'Email or Username'}
              value={emailOrUsername}
              onChange={(e) => onChange(e, 'emailOrUsername')}
              className="w-full bg-transparent focus:outline-none text-sm input-focus"
              aria-label={isSignUp ? 'Email' : 'Email or Username'}
            />
          </div>
          <div className={inputClasses}>
            <FontAwesomeIcon icon={faLock} className={iconClasses} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => onChange(e, 'password')}
              className="w-full bg-transparent focus:outline-none text-sm input-focus"
              aria-label="Password"
            />
          </div>
        </div>
        <button type="submit" className={`${buttonClasses} mb-3 text-sm`}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
        {!isSignUp && (
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={`${googleButtonClasses} text-sm`}
          >
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>
        )}
        {error && <p className="text-red-500 mb-3 text-center text-sm animate-pulse error-animate" aria-live="assertive">{error}</p>}
        <button
          type="button"
          onClick={toggleSignUp}
          className="text-blue-500 hover:underline mt-3 text-center text-sm transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;

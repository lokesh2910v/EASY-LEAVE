import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChevronRight, User, Briefcase, Lock, LogIn } from "lucide-react";


function Login() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const table = accountType === 'manager' ? 'managers' : 'employees';
      const { data, error: dbError } = await supabase
        .from(table)
        .select()
        .eq('email', email)
        .eq('password', password)
        .single();

      if (dbError || !data) {
        setError('Invalid credentials');
        return;
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('accountType', accountType);

      // Redirect based on account type
      navigate(accountType === 'manager' ? '/manager-dashboard' : '/employee-dashboard');
    } catch (err) {
      setError('An error occurred during login');
    }
  };




  
  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Easy Leave</h1>
          <p className="text-blue-100">Sign in to access your dashboard</p>

  <h3 style="margin-top: 0;">Demo Accounts for Testing</h3>
  <p>Manager Account
     Username: manager2004@gmail.com
     Password: 12345
  </p>
  <p>Employee Account
     Username: employee2004@gmail.com
     Password: 12345
  </p>


        </div>
  
        <div className="p-6">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
  
          {/* Account type selection buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              className={`flex-1 py-2.5 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors ${
                accountType === 'employee' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
              }`}
              onClick={() => setAccountType('employee')}
              type="button"
            >
              <User size={18} className={accountType === 'employee' ? 'text-blue-500' : 'text-gray-500'} />
              <span className={accountType === 'employee' ? 'font-medium text-blue-600' : 'text-gray-700'}>Employee</span>
            </button>
            <button
              className={`flex-1 py-2.5 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors ${
                accountType === 'manager' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
              }`}
              onClick={() => setAccountType('manager')}
              type="button"
            >
              <Briefcase size={18} className={accountType === 'manager' ? 'text-blue-500' : 'text-gray-500'} />
              <span className={accountType === 'manager' ? 'font-medium text-blue-600' : 'text-gray-700'}>Manager</span>
            </button>
          </div>
  
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
  
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
  
            {/* Register link */}
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Don't have an account?</p>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="mt-1 text-blue-600 hover:text-blue-800 inline-flex items-center font-medium"
              >
                Register now
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  </div>
  
  );
}

export default Login;

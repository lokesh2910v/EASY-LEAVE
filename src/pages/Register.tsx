import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { ChevronRight, User, Briefcase, Lock, LogIn } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountType: 'employee',
    name: '',
    photoUrl: '',
    employeeId: '',
    role: '',
    dateOfJoining: '',
    dateOfBirth: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validate employee ID format
    if (name === 'employeeId') {
      const numericValue = value.replace(/\D/g, '').slice(0, 7);
      setFormData({ ...formData, [name]: numericValue });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate employee ID
    if (formData.employeeId.length !== 7) {
      toast.error('Employee ID must be exactly 7 digits');
      return;
    }

    try {
      const table = formData.accountType === 'manager' ? 'managers' : 'employees';
      
      const { data, error } = await supabase
        .from(table)
        .insert([{
          name: formData.name,
          photo_url: formData.photoUrl,
          employee_id: formData.employeeId,
          role: formData.role,
          date_of_joining: formData.dateOfJoining,
          date_of_birth: formData.dateOfBirth,
          email: formData.email,
          password: formData.password
        }])
        .select()
        .single();

      if (error) {
        if (error.message.includes('duplicate key')) {
          toast.error('Employee ID or email already exists');
        } else {
          toast.error('Registration failed. Please try again.');
        }
        return;
      }

      if (data) {
        toast.success('Registration successful!');
        navigate('/');
      }
    } catch (err) {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Register Account</h1>
          <p className="text-blue-100">Create an account to access the dashboard</p>
        </div>
  
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type (Full Width) */}
        
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
  <button
    className={`flex-1 py-2.5 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors ${
      formData.accountType === 'employee' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
    }`}
    onClick={() => setFormData({ ...formData, accountType: 'employee' })}
    type="button"
  >
    <User size={18} className={formData.accountType === 'employee' ? 'text-blue-500' : 'text-gray-500'} />
    <span className={formData.accountType === 'employee' ? 'font-medium text-blue-600' : 'text-gray-700'}>
      Employee
    </span>
  </button>
  <button
    className={`flex-1 py-2.5 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors ${
      formData.accountType === 'manager' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
    }`}
    onClick={() => setFormData({ ...formData, accountType: 'manager' })}
    type="button"
  >
    <Briefcase size={18} className={formData.accountType === 'manager' ? 'text-blue-500' : 'text-gray-500'} />
    <span className={formData.accountType === 'manager' ? 'font-medium text-blue-600' : 'text-gray-700'}>
      Manager
    </span>
  </button>
</div>


  
            {/* Grid Layout (2-Column) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Enter 7-digit ID"
                  maxLength={7}
                  required
                />
              </div>
  
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
  
              {/* Photo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  name="photoUrl"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.photoUrl}
                  onChange={handleChange}
                />
              </div>
  
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  name="role"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
  
              {/* Date of Joining */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  required
                />
              </div>
  
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
  
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
  
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
  
            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Register</span>
            </button>
  
            {/* Login Navigation */}
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>Already have an account?</p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-1 text-blue-600 hover:text-blue-800 inline-flex items-center font-medium"
              >
                Login
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

export default Register;
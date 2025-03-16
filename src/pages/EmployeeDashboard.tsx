
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { LogOut, User, Calendar, Clock, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import { BiCategory } from 'react-icons/bi';

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    category: '',
    reason: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
    fetchLeaveHistory();
  }, [navigate]);

  const fetchLeaveHistory = async () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      const { data } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('employee_id', userData.id)
        .eq('status', activeTab)
        .order('created_at', { ascending: false });
      
      if (data) setLeaveHistory(data);
    } catch (error) {
      console.error('Error fetching leave history:', error);
      toast.error('Failed to load leave history');
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, [activeTab]);

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('leave_requests')
        .insert({
          employee_id: user.id,
          start_date: leaveForm.startDate,
          end_date: leaveForm.endDate,
          reason: leaveForm.reason,
          category:leaveForm.category,
          status: 'pending'
        });

      if (error) {
        toast.error('Failed to submit leave request');
        return;
      }

      toast.success('Leave request submitted successfully');
      setShowLeaveForm(false);
      setLeaveForm({ startDate: '', endDate: '', reason: '',category:'' });
      fetchLeaveHistory();
    } catch (error) {
      toast.error('Error submitting leave request');
      console.error('Error submitting leave request:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accountType');
    navigate('/');
  };

  // Calculate total days between two dates
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 px-6 py-3 border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
      Employee Dashboard
    </h1>

    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  </div>
</header>


      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar with profile */}
          <div className="lg:w-1/3">
            <div className="glass-card rounded-xl p-6 animate-fade-in shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Your Profile</h2>
              
              <div className="flex flex-col items-center mb-6">
  {user?.photo_url ? (
    <img
      src={user.photo_url}
      alt={user.name}
      className="w-36 h-36 rounded-2xl object-cover shadow-lg mb-5"
    />
  ) : (
    <div className="w-36 h-36 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center shadow-lg mb-5">
      <span className="text-5xl text-primary font-medium">{user?.name?.[0]?.toUpperCase()}</span>
    </div>
  )}
  <h3 className="text-xl font-semibold">{user?.name}</h3>
  <p className="text-base text-gray-600">{user?.role}</p>
</div>

              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <User size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="font-medium">{user?.employee_id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <User size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Calendar size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Joining</p>
                    <p className="font-medium">{user?.date_of_joining && format(new Date(user.date_of_joining), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Calendar size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{user?.date_of_birth && format(new Date(user.date_of_birth), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content area with leave management */}
          <div className="lg:w-2/3">
            <div className="glass-card rounded-xl p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Leave Management</h2>
                
                <button 
  onClick={() => setShowLeaveForm(!showLeaveForm)}
  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-95"
>
  <Plus size={18} />
  Apply for Leave
</button>

              </div>

              {/* Leave Application Form */}
              {showLeaveForm && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">New Leave Application</h3>
                    <button
                      onClick={() => setShowLeaveForm(false)}
                      className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleLeaveSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          value={leaveForm.startDate}
                          onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          value={leaveForm.endDate}
                          onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Type of Leave</label>
                     <select
                  value={leaveForm.category || ''}
                  onChange={(e) => setLeaveForm({ ...leaveForm, category: e.target.value })}
                  className="px-4 py-2 border rounded-lg pb-4"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Maternity/Paternity Leave">Maternity/Paternity Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                  <option value="Compensatory Off">Compensatory Off </option>
                </select>
                </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leave</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        rows={4}
                        value={leaveForm.reason}
                        onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end">
                    <div className="flex space-x-4">
  <button
    type="button"
    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 transition-all duration-300 hover:bg-gray-100 active:scale-95"
    onClick={() => setShowLeaveForm(false)}
  >
    Cancel
  </button>

  <button
    type="submit"
    className="px-4 py-2 bg-blue-600 text-white rounded-lg transition-all duration-300 hover:bg-blue-700 focus:ring focus:ring-blue-300 active:scale-95"
  >
    Submit Application
  </button>
</div>

                    </div>
                  </form>
                </div>
              )}
              
              {/* Leave Status Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'pending' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'approved' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab('approved')}
                >
                  Approved
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'rejected' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                  }`}
                  onClick={() => setActiveTab('rejected')}
                >
                  Rejected
                </button>
              </div>
              
              {/* Leave History List */}
              <div className="space-y-4">
                {leaveHistory.map((leave) => (
                  <div 
                    key={leave.id} 
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="font-medium">{format(new Date(leave.start_date), 'MMM dd, yyyy')}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="font-medium">{format(new Date(leave.end_date), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="font-medium">{leave.category}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-medium">{calculateDays(leave.start_date, leave.end_date)} days</p>
                      </div>
                      
                      <div className="col-span-2 md:col-span-3">
                        <p className="text-xs text-gray-500">Reason</p>
                        <p className="font-medium">{leave.reason}</p>
                      </div>
                      
                      <div className="col-span-2 md:col-span-3 flex justify-end">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                          leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {leaveHistory.length === 0 && (
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Clock className="text-gray-300 mb-2" size={48} />
                      <p className="text-gray-500 mb-1">No leave requests found</p>
                      <p className="text-sm text-gray-400">
                        {activeTab === 'pending' 
                          ? "You don't have any pending leave requests" 
                          : activeTab === 'approved'
                            ? "You don't have any approved leave requests"
                            : "You don't have any rejected leave requests"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
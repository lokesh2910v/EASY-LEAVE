
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, LogOut, X, User, Calendar, Clock, Briefcase } from 'lucide-react';

function EmployeeProfileModal({ employee, onClose }: { employee: any; onClose: () => void }) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in px-4">
    <div className="bg-white rounded-xl p-6 max-w-2xl w-full sm:max-w-lg shadow-xl animate-slide-in">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-semibold">Employee Profile</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>
  
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex-shrink-0">
          {employee.photo_url ? (
            <img
              src={employee.photo_url}
              alt={employee.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover shadow-md"
            />
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-3xl sm:text-4xl text-primary font-light">{employee.name[0].toUpperCase()}</span>
            </div>
          )}
        </div>
        <div className="flex-grow w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-3 space-x-2">
                <div className="p-2 bg-blue-50 rounded-full">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium">{employee.employee_id}</p>
                </div>
              </div>
  
              <div className="flex items-center mb-3 space-x-2">
                <div className="p-2 bg-blue-50 rounded-full">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{employee.name}</p>
                </div>
              </div>
  
              <div className="flex items-center mb-3 space-x-2">
                <div className="p-2 bg-blue-50 rounded-full">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
            </div>
  
            <div>
              <div className="flex items-center mb-3 space-x-2">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Briefcase size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{employee.role}</p>
                </div>
              </div>
  
              <div className="flex items-center mb-3 space-x-2">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Calendar size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Joining</p>
                  <p className="font-medium">{format(new Date(employee.date_of_joining), 'MMM dd, yyyy')}</p>
                </div>
              </div>
  
              <div className="flex items-center mb-3 space-x-2">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Calendar size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{format(new Date(employee.date_of_birth), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
}

function ManagerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
    fetchLeaveRequests();
    fetchLeaveHistory();
  }, [navigate]);

  const fetchLeaveRequests = async () => {
    const { data } = await supabase
      .from('leave_requests')
      .select(`
        *,
        employees (
          id,
          employee_id,
          name,
          role,
          email,
          photo_url,
          date_of_joining,
          date_of_birth
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (data) setLeaveRequests(data);
  };

  const fetchLeaveHistory = async () => {
    const { data } = await supabase
      .from('leave_requests')
      .select(`
        *,
        employees (
          id,
          employee_id,
          name,
          role,
          email,
          photo_url,
          date_of_joining,
          date_of_birth
        )
      `)
      .neq('status', 'pending')
      .order('updated_at', { ascending: false });
    
    if (data) setLeaveHistory(data);
  };

  const handleLeaveAction = async (leaveId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', leaveId);

      if (error) {
        toast.error(`Failed to ${status} leave request`);
        return;
      }

      toast.success(`Leave request ${status} successfully`);
      fetchLeaveRequests();
      fetchLeaveHistory();
    } catch (error) {
      toast.error(`Error updating leave request`);
      console.error('Error updating leave request:', error);
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
      Manager Dashboard
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

          {/* Right content area with leave requests */}
          <div className="lg:w-2/3">
            <div className="glass-card rounded-xl p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Leave Management</h2>
                
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
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
                      activeTab === 'history' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                    }`}
                    onClick={() => setActiveTab('history')}
                  >
                    History
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {(activeTab === 'pending' ? leaveRequests : leaveHistory).map((leave) => (
                  <div 
                    key={leave.id} 
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="flex-shrink-0 mr-4">
                          {leave.employees.photo_url ? (
                            <img
                              src={leave.employees.photo_url}
                              alt={leave.employees.name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                              <span className="text-xl text-primary font-light">
                                {leave.employees.name[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{leave.employees.name}</p>
                          <p className="text-sm text-gray-500">{leave.employees.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 md:space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                          leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                        
                        <button
  onClick={() => setSelectedEmployee(leave.employees)}
  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg transition-all duration-300 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-300 active:scale-95"
>
  View Profile
</button>

                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
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
                      
                      <div className="col-span-3">
                        <p className="text-xs text-gray-500">Reason</p>
                        <p className="font-medium">{leave.reason}</p>
                      </div>
                    </div>
                    
                    {activeTab === 'pending' && (
     <div className="mt-4 flex justify-end space-x-3">
     <button
       onClick={() => handleLeaveAction(leave.id, 'approved')}
       className="text-sm py-1.5 px-4 rounded-md bg-green-500 text-white shadow-md transition-all duration-200 transform hover:bg-green-600 hover:scale-105 active:scale-95"
     >
       Approve
     </button>
     <button
       onClick={() => handleLeaveAction(leave.id, 'rejected')}
       className="text-sm py-1.5 px-4 rounded-md bg-red-500 text-white shadow-md transition-all duration-200 transform hover:bg-red-600 hover:scale-105 active:scale-95"
     >
       Reject
     </button>
   </div>
   
       
               
                    )}
                  </div>
                ))}
                
                {(activeTab === 'pending' ? leaveRequests : leaveHistory).length === 0 && (
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Clock className="text-gray-300 mb-2" size={48} />
                      <p className="text-gray-500 mb-1">No leave requests found</p>
                      <p className="text-sm text-gray-400">
                        {activeTab === 'pending' 
                          ? "You don't have any pending leave requests to review" 
                          : "No past leave requests are available"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Profile Modal */}
      {selectedEmployee && (
        <EmployeeProfileModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}

export default ManagerDashboard;

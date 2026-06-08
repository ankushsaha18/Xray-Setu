'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import useAuth from '../../hooks/useAuth';
import Image from 'next/image';
import { 
  Stethoscope, 
  Heart, 
  Calendar, 
  User, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Plus,
  Search,
  Filter,
  X
} from 'lucide-react';

export default function NurseDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data for demonstration - updated to include patientName
  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', age: 45, gender: 'Male', lastScan: '2023-05-15', status: 'Normal', patientName: 'John Doe' },
    { id: 2, name: 'Jane Smith', age: 32, gender: 'Female', lastScan: '2023-05-14', status: 'Normal', patientName: 'Jane Smith' },
    { id: 3, name: 'Robert Johnson', age: 67, gender: 'Male', lastScan: '2023-05-12', status: 'Critical', patientName: 'Robert Johnson' },
    { id: 4, name: 'Emily Davis', age: 28, gender: 'Female', lastScan: '2023-05-10', status: 'Normal', patientName: 'Emily Davis' },
  ]);

  // State for search and filter functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredPatients, setFilteredPatients] = useState(patients);

  const stats = [
    { title: 'Total Patients', value: '142', icon: User, change: '+12%' },
    { title: 'Scans Today', value: '24', icon: FileText, change: '+5%' },
    { title: 'Normal Reviews', value: '8', icon: Clock, change: '-3%' },
    { title: 'Critical Cases', value: '3', icon: AlertTriangle, change: '+1%' },
  ];

  // Load recent patient data from session storage
  useEffect(() => {
    const recentPatientData = sessionStorage.getItem('recentPatientData');
    if (recentPatientData) {
      try {
        const parsedData = JSON.parse(recentPatientData);
        if (Array.isArray(parsedData)) {
          setPatients(prevPatients => {
            // Combine existing patients with recent patients
            const combinedPatients = [...parsedData, ...prevPatients];
            // Remove duplicates based on id
            const uniquePatients = combinedPatients.filter((patient, index, self) => 
              index === self.findIndex(p => p.id === patient.id)
            );
            // Keep only the first 10 patients to prevent the list from growing too large
            return uniquePatients.slice(0, 10);
          });
        }
      } catch (e) {
        console.error('Error parsing recent patient data:', e);
      }
    }
  }, []);
  
  // Filter patients based on search term and status filter
  useEffect(() => {
    let result = patients;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(patient => 
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(patient => patient.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    setFilteredPatients(result);
  }, [searchTerm, statusFilter, patients]);
  
  // Function to handle patient click - store patient data in sessionStorage for result page
  const handlePatientClick = (patient: any) => {
    // Store patient data in sessionStorage so the result page can access it
    sessionStorage.setItem('selectedPatient', JSON.stringify(patient));
    router.push('/result');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name || user?.username || 'Nurse'}
            </h1>
            <p className="text-gray-400">
              Here's what's happening with your patients today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary-900/50 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                  <span className="text-sm text-emerald-400 font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last week</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Patient Scans</h2>
                  <button 
                    onClick={() => router.push('/analyze')}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white text-sm font-medium rounded-lg transition-all"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Scan
                  </button>
                </div>
                
                {/* Search and Filter Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-5 w-5 text-gray-400 hover:text-white" />
                      </button>
                    )}
                  </div>
                  
                  <div className="relative">
                    <select
                      className="appearance-none bg-gray-800 border border-gray-700 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-primary-500 focus:outline-none text-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="normal">Normal</option>
                      <option value="critical">Critical</option>
                      
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-900/50 flex items-center justify-center mr-4">
                            <User className="h-5 w-5 text-primary-400" />
                          </div>
                          <div>
                            <h3 
                              className="font-medium text-white cursor-pointer hover:text-primary-400 transition-colors"
                              onClick={() => handlePatientClick(patient)}
                            >
                              {patient.patientName || patient.name}
                            </h3>
                            <p className="text-sm text-gray-400">{patient.age} years, {patient.gender}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <p className="text-sm text-gray-400">Last scan</p>
                            <p className="text-sm font-medium text-white">{patient.lastScan}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'Critical' ? 'bg-red-900/30 text-red-400' :
                            'bg-green-900/30 text-green-400'
                          }`}>
                            {patient.status}
                          </div>
                          <button 
                            onClick={() => handlePatientClick(patient)}
                            className="ml-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No patients found matching your search criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Quick Actions */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  <button 
                    onClick={() => router.push('/analyze')}
                    className="w-full flex items-center p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary-900/50 flex items-center justify-center mr-4">
                      <Plus className="h-5 w-5 text-primary-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">New Patient Scan</h3>
                      <p className="text-sm text-gray-400">Upload and analyze a new X-ray</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="w-full flex items-center p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary-900/50 flex items-center justify-center mr-4">
                      <Search className="h-5 w-5 text-primary-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">Search Patients</h3>
                      <p className="text-sm text-gray-400">Find patient records</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setStatusFilter('all')}
                    className="w-full flex items-center p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary-900/50 flex items-center justify-center mr-4">
                      <Filter className="h-5 w-5 text-primary-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">Filter Results</h3>
                      <p className="text-sm text-gray-400">Apply filters to scans</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-6">Recent Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-gray-800/50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">3 normal reviews</p>
                      <p className="text-xs text-gray-400">Action required</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-gray-800/50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">New system update</p>
                      <p className="text-xs text-gray-400">Version 2.1.0 released</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-3 bg-gray-800/50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">Daily report ready</p>
                      <p className="text-xs text-gray-400">View today's analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
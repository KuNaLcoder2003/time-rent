import React, { useEffect, useState } from 'react';
import { Clock, Calendar, User, Copy, CheckCircle, LogOut, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: string;
  serviceName: string;
  clientName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: string;
  rate: number;
}

const Dashboard = () => {
  const [copySuccess, setCopySuccess] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    totalEarnings: 0,
    upcomingBookings: [],
    completedBookings: [],
    hashed_email: "",
    bookingUrl :"",
  })

  interface user {
    first_name: string,
    last_name: string,
    email: string,
    password?: string,
    hashed_email: string
  }

 

  useEffect(() => {
    try {
      fetch('http://localhost:3000/api/v1/user/details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: `${localStorage.getItem('token')}`
        }
      }).then(async (response: any) => {
        const data = await response.json()

        if (data.user) {
          setUserDetails({
            name: `${data.user.first_name} ${data.user.last_name}`,
            email: data.user.email,
            totalEarnings: 20,
            upcomingBookings: data.recvd_bookings,
            completedBookings: [],
            hashed_email: data.user.hashed_email,
            bookingUrl : `https://time-rent.vercel.app/book/${data.user.hashed_email}`
          })
          
          
        }
      })
    } catch (error) {
      console.log(error)
    }
  }, [])

  const mockBookings: Booking[] = [
    {
      id: '1',
      serviceName: 'Math Tutoring',
      clientName: 'John Smith',
      date: '2025-01-15',
      time: '2:00 PM',
      status: 'upcoming',
      duration: '1 hour',
      rate: 45
    },
    {
      id: '2',
      serviceName: 'Calculus Help',
      clientName: 'Emily Johnson',
      date: '2025-01-16',
      time: '4:00 PM',
      status: 'upcoming',
      duration: '1.5 hours',
      rate: 45
    },
    {
      id: '3',
      serviceName: 'Statistics Review',
      clientName: 'Mike Davis',
      date: '2025-01-12',
      time: '10:00 AM',
      status: 'completed',
      duration: '2 hours',
      rate: 45
    }
  ];
  const navigate = useNavigate()

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(userDetails.bookingUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  const upcomingBookings = mockBookings.filter(booking => booking.status === 'upcoming');
  const completedBookings = mockBookings.filter(booking => booking.status === 'completed');
  const totalEarnings = completedBookings.reduce((total, booking) => {
    const hours = parseFloat(booking.duration.split(' ')[0]);
    return total + (booking.rate * hours);
  }, 0);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
                TimeRent
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <p onClick={()=>navigate(`/dashboard/availabililty/${userDetails.email}`)} className="text-blue-600 font-medium cursor-pointer">Set Availability</p>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Bookings</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Profile</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Earnings</a>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {`${userDetails.name}`}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your bookings today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">${userDetails.totalEarnings}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl font-bold">$</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
                <p className="text-2xl font-bold text-blue-600">{userDetails.upcomingBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{userDetails.completedBookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hourly Rate</p>
                <p className="text-2xl font-bold text-gray-900">${mockBookings[0]?.rate || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Copy Booking Link */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Share Your Booking Link</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-50 p-3 rounded-lg border">
              <p className="text-gray-600 text-sm break-all">{userDetails.bookingUrl}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${copySuccess
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {copySuccess ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copy My Booking Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Bookings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Bookings</h2>
            <div className="space-y-4">
              {userDetails.upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{booking.serviceName}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {booking.clientName}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {booking.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {booking.time}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Duration: {booking.duration} • Rate: ${booking.rate}/hour
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming bookings</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {!(userDetails.completedBookings.length > 0) ? <p>No bookings completed yet</p> :
                userDetails.completedBookings.map((booking, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{'Kunal Singh'}</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        Completed
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {'Ravinder Singh'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {'19-08-2025'}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Duration: {'1hrs'}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        +${90}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Calendar, User, Video, Copy, Eye, EyeOff, ArrowLeft, Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface MeetingDetails {
  meetingUrl: string;
  meetingId: string;
  password: string;
  hostName: string;
  sessionTitle: string;
  date: string;
  time: string;
  duration: string;
  amount: number;
  transactionId: string;
}

const Success = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string>('');

  const [alreadyExists, setAlreadyExists] = useState(false);

  const [meetingDetails, setMeetingDetails] = useState({
    meetingUrl: "",
    meetingId: "",
    password: "",
    host_email: "",
    sessionName: "",
    date: "",
    time: '2:00 PM - 3:00 PM EST',
    duration: "1 hour",
    amount: 45,
    transactionId: 'TXN_20250115_001234'
  });

  const [loading, setLoading] = useState<Boolean>(false)



  const path = useLocation()

  useEffect(() => {

    const id = path.pathname.split('/')[3]
    const email = path.pathname.split('/')[2]
    setLoading(true);

    fetch('http://localhost:3000/api/v1/booking/make-booking/' + email + '/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (response: Response) => {
      const data = await response.json();
      console.log(data)
      if (data.message == "Booking already exists") {
        setAlreadyExists(true);
        setMeetingDetails({
          ...meetingDetails,
          meetingUrl: data.booking.meet_url,
          host_email : data.booking.to_user,
          date : data.booking.date
        })
      }
      else if (data.meetingDetails) {
        setMeetingDetails({
          ...meetingDetails,
          meetingId: data.meeting_details.id,
          meetingUrl: data.meeting_details.join_url,
          password: data.meeting_details.password,
          host_email: data.meeting_details.host_email,
          date: new Date(data.meeting_details.start_time).toString(),
          sessionName: data.meeting_details.agenda
        })
      }
      setLoading(false)
    })
  }, [])

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleJoinMeeting = () => {
    window.open(meetingDetails.meetingUrl, '_blank');
  };

  const handleDownloadCalendar = () => {
    // Generate calendar event - in real app, this would create an .ics file
    const calendarEvent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${meetingDetails.sessionName} with ${meetingDetails.host_email}
DTSTART:20250115T190000Z
DTEND:20250115T200000Z
DESCRIPTION:Meeting URL: ${meetingDetails.meetingUrl}\\nMeeting ID: ${meetingDetails.meetingId}\\nPassword: ${meetingDetails.password}
END:VEVENT
END:VCALENDAR
    `.trim();

    const blob = new Blob([calendarEvent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meeting-invite.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {
        loading ? <div>Loading....</div> : (
          alreadyExists ? <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Booking Already Exists
                </h1>
                <p className="text-gray-600">
                  You already have a session booked with {meetingDetails.host_email}
                </p>
              </div>

              {/* Meeting Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Video className="w-5 h-5 mr-2 text-blue-600" />
                    {meetingDetails.sessionName || "Zoom meeting session"}
                  </h2>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-3" />
                    <span>with {meetingDetails.host_email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>{meetingDetails.date}</span>
                  </div>
                  
                </div>

                {/* Meeting URL */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Meeting URL</p>
                      <p className="text-xs text-gray-500 break-all">{meetingDetails.meetingUrl}</p>
                    </div>
                    {/* <button
                      onClick={handleCopyUrl}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${copiedUrl
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {copiedUrl ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                        </>
                      )}
                    </button> */}
                  </div>
                </div>

                {/* Join Button */}
                <button
                  onClick={handleJoinMeeting}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Join Meeting
                </button>
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Need to reschedule? Contact {meetingDetails.host_email} directly.
                </p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline">
                  View All My Bookings
                </button>
              </div>
            </div>
          </div> : (
            <div className="min-h-screen bg-gray-50">
              {/* Navigation */}
              <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
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

                    {/* Back to Dashboard */}
                    <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">Back to Dashboard</span>
                    </button>
                  </div>
                </div>
              </nav>

              {/* Main Content */}
              <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="max-w-2xl mx-auto">
                  {/* Success Header */}
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Payment Successful!
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                      Your session has been booked successfully
                    </p>
                    <p className="text-gray-500">
                      Transaction ID: {meetingDetails.transactionId}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Session with {meetingDetails.host_email}</span>
                        <span className="font-medium">{meetingDetails.sessionName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">{meetingDetails.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Date & Time</span>
                        <span className="font-medium">{meetingDetails.date} at {meetingDetails.time}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                        <span className="text-2xl font-bold text-green-600">${meetingDetails.amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Details Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl shadow-md p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Video className="w-7 h-7 mr-3 text-blue-600" />
                        Meeting Details
                      </h2>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-600">{meetingDetails.date}</span>
                      </div>
                    </div>

                    {/* Session Info */}
                    <div className="bg-white rounded-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{meetingDetails.sessionName}</h3>
                          <p className="text-gray-600 flex items-center mt-1">
                            <User className="w-4 h-4 mr-2" />
                            with {meetingDetails.host_email}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Time</div>
                          <div className="font-semibold text-gray-900">{meetingDetails.time}</div>
                        </div>
                      </div>
                    </div>

                    {/* Meeting Access Details */}
                    <div className="space-y-4">
                      {/* Meeting URL */}
                      <div className="bg-white rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meeting URL
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg border text-sm break-all">
                            {meetingDetails.meetingUrl}
                          </div>
                          <button
                            onClick={() => handleCopy(meetingDetails.meetingUrl, 'url')}
                            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center ${copiedField === 'url'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                          >
                            {copiedField === 'url' ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Meeting ID */}
                      <div className="bg-white rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meeting ID
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg border font-mono text-lg">
                            {meetingDetails.meetingId}
                          </div>
                          <button
                            onClick={() => handleCopy(meetingDetails.meetingId.replace(/\s/g, ''), 'id')}
                            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center ${copiedField === 'id'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                          >
                            {copiedField === 'id' ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Meeting Password */}
                      <div className="bg-white rounded-xl p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meeting Password
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg border font-mono text-lg relative">
                            <div className="flex items-center justify-between">
                              <span>{showPassword ? meetingDetails.password : '••••••••••••'}</span>
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600 ml-2"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(meetingDetails.password, 'password')}
                            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center ${copiedField === 'password'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                          >
                            {copiedField === 'password' ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <button
                        onClick={handleJoinMeeting}
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                      >
                        <Video className="w-5 h-5 mr-2" />
                        Join Meeting Now
                      </button>
                      <button
                        onClick={handleDownloadCalendar}
                        className="flex-1 bg-white text-gray-700 border-2 border-gray-200 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Add to Calendar
                      </button>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-blue-50 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-blue-900 mb-3">Important Notes:</h3>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Please join the meeting 5 minutes before the scheduled time
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        A confirmation email with these details has been sent to your email
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        If you need to reschedule, please contact {meetingDetails.host_email} at least 24 hours in advance
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        For technical support, visit our help center or contact support
                      </li>
                    </ul>
                  </div>

                  {/* Footer Actions */}
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Need help? Contact our support team or visit the help center
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        Contact Support
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        View Help Center
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        Download Receipt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )
      }
    </>
  );
};

export default Success;
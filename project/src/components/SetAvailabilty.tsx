import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, Save } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface WeeklyAvailability {
  [key: string]: DayAvailability;
}

const SetAvailability = () => {
  const [availabilityType, setAvailabilityType] = useState<'weekly' | 'onetime'>('weekly');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const daysOfWeek = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  const [availability, setAvailability] = useState<WeeklyAvailability>(() => {
    const initialAvailability: WeeklyAvailability = {};
    daysOfWeek.forEach(day => {
      initialAvailability[day.key] = {
        enabled: false,
        timeSlots: [{ start: '09:00', end: '17:00' }]
      };
    });
    return initialAvailability;
  });

  const toggleDay = (dayKey: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey].enabled
      }
    }));
  };

  const updateTimeSlot = (dayKey: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: prev[dayKey].timeSlots.map((slot, index) =>
          index === slotIndex ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const addTimeSlot = (dayKey: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: [...prev[dayKey].timeSlots, { start: '09:00', end: '17:00' }]
      }
    }));
  };

  const path = useLocation()

  const removeTimeSlot = (dayKey: string, slotIndex: number) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: prev[dayKey].timeSlots.filter((_, index) => index !== slotIndex)
      }
    }));
  };

  const handleSave = () => {
    console.log(availability)
    // Handle save logic here
    fetch('http://localhost:3000/api/v1/user/setAvailability/' + path.pathname.split('/')[3] , {
      method : 'POST' , 
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        availability : availability
      })
    }).then(async(response : Response)=>{
      const data = await response.json()
      console.log(data)
    })
  };

  const enabledDaysCount = Object.values(availability).filter(day => day.enabled).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-400 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Set Your Availability</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the days and times when you're available to accept bookings. You can set different time slots for each day.
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Availability Updated Successfully!
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
            {/* Availability Type */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability Type</h2>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="availabilityType"
                    value="weekly"
                    checked={availabilityType === 'weekly'}
                    onChange={(e) => setAvailabilityType(e.target.value as 'weekly')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium">Repeat Weekly</span>
                    <span className="block text-sm text-gray-500">Set a recurring schedule that repeats every week</span>
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="availabilityType"
                    value="onetime"
                    checked={availabilityType === 'onetime'}
                    onChange={(e) => setAvailabilityType(e.target.value as 'onetime')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium">One-time Availability</span>
                    <span className="block text-sm text-gray-500">Set availability for specific dates only</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Days Selection */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Select Available Days
                {enabledDaysCount > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({enabledDaysCount} day{enabledDaysCount !== 1 ? 's' : ''} selected)
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.key}
                    onClick={() => toggleDay(day.key)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      availability[day.key].enabled
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{day.short}</div>
                    <div className="text-xs mt-1 hidden md:block">{day.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots for Each Day */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Time Slots</h2>
              {daysOfWeek.map((day) => {
                if (!availability[day.key].enabled) return null;
                
                return (
                  <div key={day.key} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        {day.label}
                      </h3>
                      <button
                        onClick={() => addTimeSlot(day.key)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        + Add Time Slot
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {availability[day.key].timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 flex-1">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updateTimeSlot(day.key, slotIndex, 'start', e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="text-gray-400 mt-6">to</div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updateTimeSlot(day.key, slotIndex, 'end', e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          {availability[day.key].timeSlots.length > 1 && (
                            <button
                              onClick={() => removeTimeSlot(day.key, slotIndex)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium mt-6"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {enabledDaysCount === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select days above to set your time slots</p>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-center pt-6">
              <button
                onClick={handleSave}
                disabled={enabledDaysCount === 0}
                className={`px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center ${
                  enabledDaysCount > 0
                    ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-5 h-5 mr-2" />
                Save Availability
              </button>
            </div>

            {/* Helper Text */}
            <div className="text-center text-sm text-gray-500 pt-4">
              <p>Your availability will be visible to potential clients when they try to book you.</p>
              <p className="mt-1">You can update your schedule anytime from your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetAvailability;
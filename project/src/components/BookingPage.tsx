import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, Clock, Key } from 'lucide-react';
import { data } from 'react-router-dom';

interface TimeSlots {
    id: number,
    availabilityId: number,
    day: string,
    start_time: string,
    end_time: string
}

const Days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
]
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const no_of_days: { [Key: string]: number } = {
    'January': 31,
    'February': 28,
    'March': 31,
    'April': 30,
    'May': 31,
    'June': 30,
    'July': 31,
    'August': 31,
    'September': 30,
    'October': 31,
    'November': 30,
    'December': 31,
}

interface weeklyDates {
    date: string,
    day: string,
    month: string,
}




const BookingPage = () => {
    const [userData, setUserData] = useState({
        name: '',
        title: 'Math Tutor & Academic Coach',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        rating: 4.9,
        hourlyRate: 45,
        description: 'Experienced math tutor specializing in calculus, algebra, and test preparation. I help students build confidence and achieve their academic goals.'
    })
    const [timeSlots, setTimeSlots] = useState([])
    const [loading, setLoading] = useState(false);
    const [weeklyDates, setWeeklyDates] = useState<weeklyDates[]>([])
    const [selectedDate, setSelectedDate] = useState<weeklyDates>()
    const [availableTimeSlots, SetAvailableTimeSolts] = useState<TimeSlots[]>([])


    useEffect(() => {
        try {
            setLoading(true)
            fetch('http://localhost:3000/api/v1/booking/details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (resonse: Response) => {
                const data = await resonse.json()
                console.log(data)
                if (data.user) {

                    setUserData({
                        ...userData,
                        name: `${data.user.first_name} ${data.user.last_name}`
                    })
                    setTimeSlots(data.time_slots)
                    generateWeeklyDates(data?.time_slots)

                } else {
                    toast.error(data.message)
                }
                setLoading(false)

            })
        } catch (error) {
            toast.error('Something Went wrong')
        } finally {
            setLoading(false)
        }
    }, [])

    function generateWeeklyDates(time_slots: TimeSlots[]) {
        let arr: weeklyDates[] = []
        if (!time_slots) {
            toast.error('No time slots to show')
        }
        else {
            time_slots.forEach((obj: TimeSlots, index) => {
                let temp_obj = {
                    date: '',
                    day: '',
                    month: '',

                }
                const date = new Date()
                // console.log(date)
                const day = Days[date.getDay()]
                // console.log(date.getDate())

                if (day == obj.day) {
                    temp_obj.date = `${date.getDate}`
                    temp_obj.day = obj.day
                }
                else {
                    let idx = Days.indexOf(obj.day)
                    // console.log(obj.day)
                    // console.log('IDX = ', idx)
                    let idx1 = date.getDay();
                    let count = 0
                    let flag = true

                    while (flag) {
                        idx1++;
                        idx1 = idx1 % 7
                        if (idx1 == idx) {
                            flag = false
                        }
                        console.log(flag)
                        count++
                    }
                    console.log(count)
                    let new_date = date.getDate() + count
                    // console.log('New Date : ' , new_date)
                    // console.log('Day : ', obj.day, 'Date : ', new_date)
                    const month: string = months[date.getMonth()]

                    const max_day: number = no_of_days[month]
                    if (new_date > max_day) {
                        const next_momth = months[(date.getMonth() + 1) % 12]

                        const max_day: number = no_of_days[next_momth]


                        new_date = new_date % max_day + 1
                        temp_obj.month = next_momth

                    } else {
                        temp_obj.month = month
                    }
                    temp_obj.date = `${new_date}`
                    temp_obj.day = obj.day

                    arr.push(temp_obj)
                }

            })
        }
        setWeeklyDates(arr)
    }

    function getAvailableTimeSlots(selectedDate: weeklyDates) {

        if (!selectedDate) {
            toast.error('Please select a date')
            return
        }
        const filtered = timeSlots.filter((obj: TimeSlots) => obj.day == selectedDate.day)

        SetAvailableTimeSolts(filtered)


    }

    return (
        <>
            {
                loading ? <div>Loading...</div> : (
                    <div className='min-h-screen bg-gray-50'>

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

                                    {/* Back to Home */}
                                    <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        <span className="hidden sm:inline">Back to Home</span>
                                    </button>
                                </div>
                            </div>
                        </nav>

                        <div className='max-w-4xl m-auto mt-[4rem] h-auto p-4 rounded-lg shadow-lg'>
                            <div className='w-[100%] flex justify-start gap-10'>

                                <div className='max-w-[80px] h-[80px]'>
                                    <img className='min-w-[80px] h-[80px] rounded-full object-cover scale-[1.1]' src={userData.avatar} />
                                </div>

                                <div className='flex flex-col items-baseline gap-2'>

                                    <h1 className='text-3xl font-bold'>Book a session with {userData.name}</h1>

                                    <p className='text-xl text-blue-500 font-semibold'>{userData.title}</p>

                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <div className="flex items-center">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-gray-700 ml-1">{userData.rating}</span>
                                        </div>
                                        <div className="text-gray-500">•</div>
                                        <div className="text-gray-700 font-medium">${userData.hourlyRate}/hour</div>
                                    </div>

                                    <div className='text-gray-600 leading-relaxed'>
                                        {userData.description}
                                    </div>

                                </div>

                            </div>
                        </div>


                        <div className='max-w-4xl m-auto mt-[4rem] h-auto rounded-lg shadow-lg p-8 flex flex-col gap-2'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>Select an available time slot</h2>
                            <div className='p-4 w-[90%] rounded-lg m-auto'>
                                <div className='bg-blue-100 p-4 rounded-lg'>
                                    <h3 className='text-md font-semibold text-blue-700'>Available Days : </h3>
                                    <div className='flex items-center gap-4 mt-4'>
                                        {
                                            timeSlots.map((obj: TimeSlots, index) => {
                                                return (
                                                    <p className='bg-blue-300 p-1 rounded-lg text-blue-800 font-semibold' key={index}>{obj.day}: {obj.start_time} - {obj.end_time} </p>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                <div className='mt-8'>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                                        Choose a Date
                                    </h3>
                                    <div className='flex items-center p-2 gap-4'>
                                        {
                                            weeklyDates.map((obj: weeklyDates, index) => {
                                                return (
                                                    <p onClick={() => { setSelectedDate(obj); getAvailableTimeSlots(obj) }} key={index} className='border-2 border-blue-400 cursor-pointer p-2 rounded-lg text-blue-700'>{obj.day} , {obj.month} {obj.date}</p>
                                                )
                                            })
                                        }
                                    </div>

                                    <div className='mt-8'>
                                        {
                                            availableTimeSlots.length > 0 ? <>
                                                <h3>Availabe time slots for {selectedDate?.date}<sup>th</sup>{selectedDate?.month}</h3>
                                                <div className='flex items-center gap-6 p-2'>

                                                    {
                                                        availableTimeSlots.map((obj: TimeSlots, index) => {
                                                            return (
                                                                <div className='flex flex-col items-start bg-blue-100 p-4 px-8 rounded-lg cursor-pointer'>
                                                                    <p className='text-blue-700 font-semibold'>Start Time : {obj.start_time}</p>
                                                                    <p className='text-blue-500 font-lg'>Duration : 1 hrs</p>
                                                                    <p className='text-blue-500 font-lg'>Price : ${userData.hourlyRate}/hour</p>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </> : (null)
                                        }

                                    </div>
                                </div>
                            </div>

                            <button className='self-center text-center mt-4 p-4 w-[30%] rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold text-lg'>Book slot</button>

                        </div>

                        

                    </div>
                )
            }
        </>
    )
}

export default BookingPage

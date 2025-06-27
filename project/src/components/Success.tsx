import React, { useEffect } from 'react'

const Success = () => {
  useEffect(()=> {

    fetch('http://localhost:3000/api/v1/booking/make-booking' , {
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        bookingId : Number(localStorage.getItem('booking'))
      })
    }).then(async(response : Response)=> {
      const data = await response.json()
      console.log(data)
    })
  } , [])
  return (
    <div className='flex items-center justify-center'>
        Payment Done
    </div>
  )
}

export default Success

import express from "express"
import { PrismaClient } from "../../generated/prisma"
const prisma  = new PrismaClient()

const booking_router = express.Router()



booking_router.post('/makingBooking' , async(req :express.Request , res : express.Response)=> {
    const {to_email , amount , } = req.body.details
    try {
        
    } catch (error) {
        
    }
}) 

booking_router.get('/details' , async(req :express.Request , res : express.Response)=> {
    
    try {
        const user = await prisma.user.findFirst({
            where : {email : "kunalindia59@gmail.com"}
        })

        if(!user) {
            res.status(404).json({
                message : 'User not found'
            })
            return
        }
        const available = await prisma.availability.findMany({
            where : {user_email : "kunalindia59@gmail.com"}
        })

        if(available.length ==0 ) {
            res.status(402).json({
                message : 'No availabililty'
            })
            return
        }
        const availability_ids = available.map((obj) => {
            return obj.id
        })

        const time_slots = await prisma.timeSlot.findMany({
            where: {
                availabilityId: {
                    in: availability_ids
                }
            }
        });

        if (time_slots.length === 0) {
            res.status(400).json({ message: 'No time slots found for available dates' });
            return
        }

        res.status(200).json({
            time_slots,
            user
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message : 'something went wrong'
        })
    }
})



export default booking_router;
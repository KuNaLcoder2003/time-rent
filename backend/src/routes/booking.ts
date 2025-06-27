import express from "express"
import { PrismaClient } from "../../generated/prisma"

import Stripe from "stripe"
import authMiddleware from "../middlewares/authMiddleWare"
import dotenv from "dotenv"


dotenv.config()

const stripe_api_secret = process.env.STRIPE_SECRET

const stripe = new Stripe(`${stripe_api_secret}`)

const prisma = new PrismaClient()

const booking_router = express.Router()

booking_router.post('/create-payment', async (req: express.Request, res: express.Response) => {
    const { amount, timeSlots ,email , user_email } = req.body

    try {

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: 'TimeSlot booking for ' + `${timeSlots?.day} ${timeSlots.date}`
                        },
                        unit_amount: amount * 100
                    },
                    quantity: 1
                }
            ]
        })
        const new_booking = await prisma.booking.create({
            data: {
                from_user_name: 'Lappu',
                request_user_email: email,
                created_at: new Date(),
                scheduled_at: new Date(),
                meet_url: "",
                expired: false,
                timeSlotId: timeSlots?.id,
                to_user: user_email,
                date: new Date(),
                payment : false
            }
        })
       
        res.status(200).json({
            sessionId: session.id,
            bookingId : new_booking.id
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

booking_router.put('/make-booking', async (req: express.Request, res: express.Response) => {
    const {  bookingId } = req.body;
    try {
        
            
        const updated_booking  = await prisma.booking.update({
            where : {id : bookingId},
            data : {
                payment :  true
            }
        })

        if(!updated_booking) {
            res.status(402).json({
                message : 'Not able to book the slot , will initiate refund'
            })
            return
        }
        res.status(200).json({
            message : 'Booking confirmed',
            booking : updated_booking
        })

    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

booking_router.get('/details/:email', async (req: express.Request, res: express.Response) => {

    const email  = req.params.email


    try {
        const user = await prisma.user.findFirst({
            where: { email: email }
        })

        if (!user) {
            res.status(404).json({
                message: 'User not found'
            })
            return
        }
        const available = await prisma.availability.findMany({
            where: { user_email: "kunalindia59@gmail.com" }
        })

        if (available.length == 0) {
            res.status(402).json({
                message: 'No availabililty'
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
            message: 'something went wrong'
        })
    }
})



export default booking_router;
import express from "express"
import { PrismaClient } from "../../generated/prisma"

import Stripe from "stripe"
import authMiddleware from "../middlewares/authMiddleWare"

const stripe = new Stripe("sk_test_51RcKdXR48JIxDpQaIGl3mm7LyKXOtR3mdGzPnNnhUgFKQCi08Zh0zaXGHuUG2hkgV0nszPtvhjbd4QdZ0CQq891900RdQRg8ap")




const prisma = new PrismaClient()

const booking_router = express.Router()



booking_router.post('/create-payment', async (req: express.Request, res: express.Response) => {
    const { amount, timeSlots } = req.body
    const user_email = "kunalindia59@gmail.com"

    try {

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/",
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
        console.log(session.id)
        res.status(200).json({
            sessionId: session.id
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

booking_router.post('/make-booking', async (req: express.Request, res: express.Response) => {
    const { email, timeSlot, to_email } = req.body.email;
    try {
        if (!email) {
            res.status(400).json({
                message: 'Bad request'
            })
            return
        }

        const new_booking = prisma.booking.create({
            data: {
                from_user_name: 'Lappu',
                request_user_email: email,
                created_at: new Date(),
                scheduled_at: new Date(),
                meet_url: "",
                expired: false,
                timeSlotId: timeSlot?.id,
                to_user: to_email,
                date: new Date()
            }
        })
        if (!new_booking) {
            res.status(402).json({
                message: 'Not able to create booking at the moment'
            })
            return
        }

    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

booking_router.get('/details', async (req: express.Request, res: express.Response) => {

    try {
        const user = await prisma.user.findFirst({
            where: { email: "kunalindia59@gmail.com" }
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
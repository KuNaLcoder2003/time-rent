import express from "express"
import { PrismaClient } from "../../generated/prisma"

import Stripe from "stripe"
import authMiddleware from "../middlewares/authMiddleWare"
import dotenv from "dotenv"
const base = require('base-64');
import bcrypt from "bcrypt"
import router from "."


dotenv.config()

const stripe_api_secret = process.env.STRIPE_SECRET

const stripe = new Stripe(`${stripe_api_secret}`)
const zoomAccountId = `${process.env.ZOOM_ACCOUNT_ID}`
const zoomClientId = `${process.env.ZOOM_CLIENT_ID}`
const zoomClientSecret = `${process.env.ZOOM_CLIENT_SECRET}`

const prisma = new PrismaClient()

const booking_router = express.Router()

const getAuthHeaders = () => {
    return {
        Authorization: `Basic ${base.encode(
            `${zoomClientId}:${zoomClientSecret}`
        )}`,
        "Content-Type": "application/json",
    };
};

const generateZoomAccessToken = async () => {
    try {
        const response = await fetch(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`,
            {
                method: "POST",
                headers: getAuthHeaders(),
            }
        );
        const jsonResponse = await response.json();
        return jsonResponse?.access_token;
    } catch (error) {
        console.log("generateZoomAccessToken Error --> ", error);
        throw error;
    }
};

type invitee = string
interface zoomResponse {
    uuid: string,
    host_email: string,
    topic: string,
    duration: number,
    start_url: string,
    join_url: string,
    password: string,

}
const generateZoomMeeting = async (invitees: invitee[] , email : string , name : string) => {
    let res;
    try {
        const zoomAccessToken = await generateZoomAccessToken();

        const response = await fetch(
            `https://api.zoom.us/v2/users/me/meetings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${zoomAccessToken}`,
                },
                body: JSON.stringify({
                    agenda: "Zoom Meeting for YT Demo",
                    default_password: false,
                    duration: 60,
                    password: "12345",

                    settings: {
                        allow_multiple_devices: true,

                        alternative_hosts_email_notification: true,
                        breakout_room: {
                            enable: true,
                            rooms: [
                                {
                                    name: "room1",
                                    participants: invitees.map(obj => {
                                        return obj
                                    })
                                },
                            ],
                        },
                        calendar_type: 1,
                        contact_email:email ,
                        contact_name: name,
                        email_notification: true,
                        encryption_type: "enhanced_encryption",
                        focus_mode: true,
                        // global_dial_in_countries: ["US"],
                        host_video: true,
                        join_before_host: true,
                        meeting_authentication: true,
                        meeting_invitees: [
                            {
                                email: "garvitpriyansh@gmail.com",
                            },
                        ],
                        mute_upon_entry: true,
                        participant_video: true,
                        private_meeting: true,
                        waiting_room: false,
                        watermark: false,
                        continuous_meeting_chat: {
                            enable: true,
                        },
                    },
                    start_time: new Date().toLocaleDateString(),
                    timezone: "Asia/Kolkata",
                    topic: "Zoom Meeting for YT Demo",
                    type: 2, // 1 -> Instant Meeting, 2 -> Scheduled Meeting
                }),
            }
        );

        const jsonResponse = await response.json();


        console.log("generateZoomMeeting JsonResponse --> ", jsonResponse);
        res = jsonResponse
    } catch (error) {
        console.log("generateZoomMeeting Error --> ", error);
        throw error;
    }
    return res
};

booking_router.post('/create-payment/:email', async (req: express.Request, res: express.Response) => {
    const { amount, timeSlots, email } = req.body
    const hashed = req.params.email
    try {
        const user = await prisma.user.findFirst({
            where: { email: hashed }
        })
        if (!user) {
            res.status(404).json({
                messsage: 'Something went wrong'
            })
            return
        }
        const new_booking = await prisma.booking.create({
            data: {
                from_user_name: 'Lappu',
                request_user_email: email,
                created_at: new Date(),
                scheduled_at: new Date(),
                meet_url: "",
                expired: false,
                timeSlotId: timeSlots?.id,
                to_user: user.email,
                date: new Date(),
                payment: false
            }
        })
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url: "http://localhost:5173/success/" + user.email + '/' + new_booking.id ,
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
        
        res.status(200).json({
            sessionId: session.id,
            bookingId: new_booking.id
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

booking_router.post('/make-booking/:email/:id', async (req: express.Request, res: express.Response) => {
    const {  request_email } = req.body;
    const email = req.params.email as string
    const id = req.params.id;
    try {
        const user = await prisma.user.findFirst({
            where: { email : email }
        })
        if (!user) {
            if (!user) {
                res.status(404).json({
                    messsage: 'Something went wrong'
                })
                return
            }
        }
        const response = await generateZoomMeeting([user.email, request_email] ,user.email , `${user.first_name} ${user.last_name}` )
        const updated_booking = await prisma.booking.update({
            where: { id: Number(id) },
            data: {
                payment: true
            }
        })
        if (!updated_booking) {
            res.status(402).json({
                message: 'Not able to book the slot , will initiate refund'
            })
            return
        }
        res.status(200).json({
            message: 'Booking confirmed',
            booking: updated_booking,
            meeting_details: response
        })
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

booking_router.get('/details/:email', async (req: express.Request, res: express.Response) => {
    const email = req.params.email
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
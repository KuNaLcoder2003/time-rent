import express from "express"
import { PrismaClient ,Weekday } from "../../generated/prisma"
import { generateToken } from "../functions/generateToken"
import authMiddleware from "../middlewares/authMiddleWare"
const prisma = new PrismaClient()

const user_router = express.Router()

interface New_User {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
}

interface Cred {
    email: string,
    password: string
}

type TimeSlotInput = {
    start: string;
    end: string;
};

type DayAvailability = {
    enabled: boolean;
    timeSlots: TimeSlotInput[];
};

type AvailabilityInput = {
    [day in
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday']?: DayAvailability;
};





user_router.post('/signup', async (req: express.Request, res: express.Response) => {
    const user_details: New_User = req.body.details
    try {
        if (!user_details.email || !user_details.first_name || !user_details.last_name || !user_details.password) {
            res.status(400).json({
                message: 'Bad request'
            })
            return
        }
        const user = await prisma.user.findFirst({
            where: { email: user_details.email }
        })
        if (user) {
            res.status(402).json({
                message: 'User already exists'
            })
            return
        }
        const new_user = await prisma.user.create({
            data: {
                first_name: user_details.first_name,
                last_name: user_details.last_name,
                email: user_details.email,
                password: user_details.password,
                created_at: new Date()
            }
        })
        if (!new_user) {
            res.status(403).json({
                message: 'Unable to register at the moment'
            })
            return
        }
        const token = generateToken(new_user.email)
        res.status(200).json({
            message: 'Signed up successfully',
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

user_router.post('/signin', async (req: express.Request, res: express.Response) => {
    const user_cred: Cred = req.body.cred
    try {
        if (!user_cred.email || !user_cred.password) {
            res.status(400).json({
                message: 'Bad request'
            })
            return
        }
        const user = await prisma.user.findFirst({
            where: { email: user_cred.email }
        })
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            })
            return
        }
        const token = generateToken(user.email)
        res.status(200).json({
            message: 'Successfully signedin',
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

user_router.get('/details', authMiddleware , async (req: any, res: express.Response) => {
    const email = req.email as string
    try {
        const user = await prisma.user.findFirst({
            where: { email: email }
        })
        if (!user) {
            // can never be null , if already signedup
            res.status(404).json({
                message: 'User not found'
            })
            return
        }
        const recvd_bookings = await prisma.booking.findMany({
            where: { to_user: email },  // can be empty -> if empty then show no current bookings (so no if checks)
        })

        res.status(200).json({
            user,
            recvd_bookings,

        })
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

user_router.post('/setAvailability', async (req: express.Request, res: express.Response) => {
    const availabilityObj: AvailabilityInput = req.body.availability
    try {
        for (const [day, value] of Object.entries(availabilityObj)) {
            if (!value.enabled) continue;
            // Step 1: Create availability record for that day

            const upperDay = day.toUpperCase() as keyof typeof Weekday;
            const dayEnum = Weekday[upperDay];
            const availability = await prisma.availability.create({
                data: {
                    user_email: "kunalindia59@gmail.com"
                },
            });
            if(!availability) {
                res.status(400).json({
                    message : 'Not able to set availability'
                })
                return
            }

            // Step 2: Create associated time slots
            const timeSlotsData = value.timeSlots.map(slot => ({
                availabilityId: availability.id,
                day: dayEnum ,// Prisma enum: "MONDAY", "TUESDAY", etc.
                start_time: slot.start,
                end_time: slot.end,
            }));

            const result = await prisma.timeSlot.createMany({
                data: timeSlotsData
            });
            if(!result) {
                res.status(400).json({
                    message : 'Not able the to set the time slots, try again'
                })
            }
            res.status(200).json({
                message : 'Sucessfully added time slots'            ,
                valid : true
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message : 'something went wrong'
        })
    }
})






export default user_router

import express from "express"
import user_router from "./user"
import booking_router from "./booking"

const router = express.Router()

router.use('/user' , user_router)
router.use('/booking' , booking_router)



export default router
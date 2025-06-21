"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../generated/prisma");
const generateToken_1 = require("../functions/generateToken");
const prisma = new prisma_1.PrismaClient();
const user_router = express_1.default.Router();
user_router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_details = req.body.details;
    try {
        if (!user_details.email || !user_details.first_name || !user_details.last_name || !user_details.password) {
            res.status(400).json({
                message: 'Bad request'
            });
            return;
        }
        const user = yield prisma.user.findFirst({
            where: { email: user_details.email }
        });
        if (user) {
            res.status(402).json({
                message: 'User already exists'
            });
            return;
        }
        const new_user = yield prisma.user.create({
            data: {
                first_name: user_details.first_name,
                last_name: user_details.last_name,
                email: user_details.email,
                password: user_details.password,
                created_at: new Date()
            }
        });
        if (!new_user) {
            res.status(403).json({
                message: 'Unable to register at the moment'
            });
            return;
        }
        const token = (0, generateToken_1.generateToken)(new_user.email);
        res.status(200).json({
            message: 'Signed up successfully',
            token: token
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
}));
user_router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_cred = req.body.cred;
    try {
        if (!user_cred.email || !user_cred.password) {
            res.status(400).json({
                message: 'Bad request'
            });
            return;
        }
        const user = yield prisma.user.findFirst({
            where: { email: user_cred.email }
        });
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
            return;
        }
        const token = (0, generateToken_1.generateToken)(user.email);
        res.status(200).json({
            message: 'Successfully signedin',
            token: token
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
}));
user_router.get('/details', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = "kunalindia59@gmail.com";
    try {
        const user = yield prisma.user.findFirst({
            where: { email: email }
        });
        if (!user) {
            // can never be null , if already signedup
            res.status(404).json({
                message: 'User not found'
            });
            return;
        }
        const recvd_bookings = yield prisma.booking.findMany({
            where: { to_user: email }, // can be empty -> if empty then show no current bookings (so no if checks)
        });
        res.status(200).json({
            user,
            recvd_bookings,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
}));
user_router.post('/setAvailability', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const availabilityObj = req.body.availability;
    try {
        for (const [day, value] of Object.entries(availabilityObj)) {
            if (!value.enabled)
                continue;
            // Step 1: Create availability record for that day
            const upperDay = day.toUpperCase();
            const dayEnum = prisma_1.Weekday[upperDay];
            const availability = yield prisma.availability.create({
                data: {
                    user_email: "kunalindia59@gmail.com"
                },
            });
            // Step 2: Create associated time slots
            const timeSlotsData = value.timeSlots.map(slot => ({
                availabilityId: availability.id,
                day: dayEnum, // Prisma enum: "MONDAY", "TUESDAY", etc.
                start_time: slot.start,
                end_time: slot.end,
            }));
            yield prisma.timeSlot.createMany({
                data: timeSlotsData
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'something went wrong'
        });
    }
}));
exports.default = user_router;

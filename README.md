# 🕒 TimeRent — Rent Time, Get Help

**TimeRent** is a full-stack web platform that allows users to **rent out their time** for mentoring, consulting, coaching, or other personalized services.  
Each user can **create an account**, **set their weekly availability**, and **share a public booking link** so others can schedule time with them easily.

![Alt text for accessibility](./assets/ss-1.png)

---

## 🌐 Live Demo

https://time-rent.vercel.app/

---

## 📌 Features

- 🔐 **Authentication** – Sign up and sign in with secure forms
- 📅 **Set Availability** – Let users manage when they’re free to get booked
- 📬 **Bookings Dashboard** – View current bookings, scheduled times
- 🔗 **Public Booking Link** – Shareable link for others to schedule meetings
- 📱 **Responsive UI** – Works smoothly across devices
- 🎨 **Light Theme with Blue & Green Accents** – Clean, modern UI with Tailwind

---

## 🛠️ Tech Stack

### 🔷 Frontend

- [React](https://reactjs.org/) – UI components
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [TypeScript](https://www.typescriptlang.org/) – Type-safe frontend logic

### 🔶 Backend

- [Express.js](https://expressjs.com/) – API server
- [TypeScript](https://www.typescriptlang.org/) – Strongly typed backend code
- [Prisma ORM](https://www.prisma.io/) – Simplified database interactions
- [PostgreSQL](https://www.postgresql.org/) – Relational database

---

## 📁 Project Structure



root/
├── client/ # React + Tailwind frontend
│ ├── src/ # Pages, components, and routes
│ └── public/ # Static files
├── server/ # Express + Prisma backend
│ ├── src/ # Routes, controllers, and services
│ └── prisma/ # Prisma schema and migrations
├── package.json # Root scripts (optional mono-repo style)
└── README.md




---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/timerent.git
cd timerent

cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx tsc -b
node dist/index.js

cd ../project
npm install
npm run dev



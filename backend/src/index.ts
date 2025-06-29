import express from "express"
import cors from "cors"
import router from "./routes"
import dotenv from "dotenv"

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/v1' , router)


app.listen(PORT , ()=>{
    console.log('App started')
})
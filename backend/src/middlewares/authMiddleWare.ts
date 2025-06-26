import jsonwebtoken from "jsonwebtoken"
const secret = "ihwrgt89qou90rqo"
import express from "express"

interface verified {
    email : string
}
function authMiddleware(req : any , res : express.Response , next : express.NextFunction ) {
    const authtoken = req.headers.authorization as string;
    if(!authtoken || !authtoken.startsWith('Bearer ')) {
        res.status(401).json({
            message : 'Invalid access'
        })
        return
    }
    const token = authtoken.split('Bearer ')[1]
    const verified  = jsonwebtoken.verify(token , secret) as verified
    if(!verified || !verified?.email) {
        res.status(401).json({
            message : 'Invalid access'
        })
        return
    }
    else {
        req.user_email = verified.email
        next()
    }
}
export default authMiddleware
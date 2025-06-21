import jsonwebtoken from "jsonwebtoken"
const secret = "ihwrgt89qou90rqo"

export function generateToken(user_email : String ) : String {
    const token = jsonwebtoken.sign({email : user_email} , secret)
    return token
}


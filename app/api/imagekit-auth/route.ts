import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"
import { getUploadAuthParams } from "@imagekit/next/server"
import { NextResponse } from "next/server"


export async function GET() {

    if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_PUBLIC_KEY) {
        return NextResponse.json({
            error: "Server Misconfigured",
            status: 500
        })
    }    

    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({
            error: "User not authenticated",
            status: 401
        })
    }

    await connectToDatabase()
    const user = await User.findOne({ email: session.user.email })

    if (!user || user.role !== "admin") {
        return NextResponse.json({
            error: "Forbidden - Admins Only",
            status: 403
        })
    }

    try {
        const authenticationParameters = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
            expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
            // token: "random-token", // Optional, a unique token for request
        })
    
        return NextResponse.json({ authenticationParameters, publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY })
    } catch (error) {
        return NextResponse.json({
            error: "Authentication Failed",
            status: 501
        })
    }
}
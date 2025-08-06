import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const {email, password} = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                {error: "Email and password are required"},
                {status: 401}
            )
        }

        await connectToDatabase()
        const user = await User.findOne({email: email})
        if(user){
            return NextResponse.json(
                {error: "This email user already exist"},
                {status: 401},
            )
        } 

        await User.create({
            email,
            password,
            role: "user" // Default role
        })

        return NextResponse.json(
            {message: "User regestation complete successfully"},
            {status: 201},
        )


        } catch (error) {
            console.error("Registration error:", error);
            return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}








import mongoose, {Schema, model, models} from "mongoose"
import bcrypt from "bcryptjs"


export interface IUser{
    email: string,
    password: string,
    role: "user" | "admin"
    _id?: mongoose.Types.ObjectId;
    creastedAT?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    email: {type: String, require: true, unique: true },
    password: {type: String, require: true, },
    role: {type: String, enum: ["user", "admin"], default: "user" }
},{timestamps: true});

userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})

const User = models?.User || model<IUser>("User", userSchema)

export default User;

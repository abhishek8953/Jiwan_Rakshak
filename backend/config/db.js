import {PrismaClient} from "@prisma/client"

const prisma= new PrismaClient()
prisma.$connect().then(()=>{
    console.log("db connected");
}).catch((err)=>{
    console.log("erron while connection db",err);
})

export default prisma;
import { connect } from 'mongoose'//paquete o dependecia que nos permite llamar

const dbConnection = async()=>{
    //capturar los errores
    try {
        await connect(process.env.MONGO_CNN)
        console.log('Connected to Mongo DB')
        
    } catch (error) {
        console.log(error)
        
    }
}

export default dbConnection
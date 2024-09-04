import { Schema, model } from 'mongoose';

const cuentaSchema = new Schema({
  numeroCuenta: { 
    type: Number, 
    unique: true, 
    required: true 
  },
  documentoCliente: { 
    type: String, 
    required: true 
  },
  fechaApertura: { 
    type: Date, 
    default: Date.now // Si no se proporciona una fecha usa la actual
  },
  saldo: { 
    type: Number, 
    default: 0, 
    required: true
  },
  claveAcceso: { 
    type: String, 
    required: true 
  },
});

cuentaSchema.pre('save', async function (next) {
    if (this.isNew) {
      const lastCuenta = await this.constructor.findOne().sort({ numeroCuenta: -1 });
      
      this.numeroCuenta = lastCuenta ? lastCuenta.numeroCuenta + 1 : 1;
    }
    
    next();
  });

export default model('Cuenta', cuentaSchema, 'cuenta');
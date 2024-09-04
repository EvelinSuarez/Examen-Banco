// controllers/cuentaController.js
import bcrypt from 'bcryptjs'; // Para encriptar contraseñas
import Cuenta from '../models/cuenta.js'; // Importar el modelo de Cuenta

// Obtener todas las cuentas
export async function getCuenta(req, res) {
    try {
        const cuentas = await Cuenta.find(); // Buscar todas las cuentas en la base de datos
        res.json(cuentas); // Enviar las cuentas como respuesta en formato JSON
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las cuentas' }); // Manejo de errores
    }
}

// Crear una nueva cuenta
export async function postCuenta(req, res) {
    const body = req.body; // Obtener los datos del cuerpo de la solicitud

    try {
        // Validar que el saldo no sea negativo
        if (body.saldo < 0) {
            return res.status(400).json({ message: 'El saldo no puede ser negativo' });
        }

        // Validar que la clave de acceso tenga exactamente 4 dígitos
        if (!body.claveAcceso || body.claveAcceso.length !== 4) {
            return res.status(400).json({ message: 'La clave de acceso debe tener exactamente 4 dígitos' });
        }

        // Encriptar la clave de acceso
        const salt = await bcrypt.genSalt(10);
        const claveEncriptada = await bcrypt.hash(body.claveAcceso, salt);

        // Crear una nueva cuenta con los datos del cuerpo
        const cuenta = new Cuenta({
            ...body,
            claveAcceso: claveEncriptada
        });

        // Guardar la nueva cuenta en la base de datos
        await cuenta.save(); 

        res.status(201).json({ message: 'Cuenta creada exitosamente' }); // Respuesta de éxito
    } catch (error) {
        console.error('Error al crear la cuenta:', error);
        res.status(500).json({ message: 'Problemas al crear la cuenta', error }); // Manejo de errores
    }
}


export async function putconsignarDinero(req, res) {
    const { _id, montoConsignar } = req.body;
    
    try {
        if (montoConsignar <= 0) {
            return res.status(400).json({ message: 'El monto a consignar debe ser mayor a 0' });
        }
        
        const cuenta = await Cuenta.findById(_id);
        if (!cuenta) {
            return res.status(404).json({ message: 'Cuenta no encontrada' });
        }
        
        cuenta.saldo += montoConsignar;
        await cuenta.save();
        
        res.json({ message: 'Consignación realizada correctamente', saldoActual: cuenta.saldo });
    } catch (error) {
        res.status(500).json({ message: 'Error al consignar dinero', error });
    }
}


export async function putretirarDinero(req, res) {
    const { _id, montoRetirar } = req.body;
    
    try {
        if (montoRetirar <= 0) {
            return res.status(400).json({ message: 'El monto a retirar debe ser mayor a 0' });
        }
        
        const cuenta = await Cuenta.findById(_id);
        if (!cuenta) {
            return res.status(404).json({ message: 'Cuenta no encontrada' });
        }
        
        if (montoRetirar > cuenta.saldo) {
            return res.status(400).json({ message: 'No se puede retirar la cantidad deseada porque no tienes saldo suficiente' });
        }
        
        cuenta.saldo -= montoRetirar;
        await cuenta.save();
        
        res.json({ message: 'Retiro realizado correctamente', saldoActual: cuenta.saldo });
    } catch (error) {
        res.status(500).json({ message: 'Error al retirar dinero', error });
    }
}

// Eliminar una cuenta
export async function deleteCuenta(req, res) {
    const { id } = req.params;
    
    try {
        const cuenta = await Cuenta.findById(id);
        if (!cuenta) {
            return res.status(404).json({ message: 'Cuenta no encontrada' });
        }
        
        if (cuenta.saldo !== 0) {
            return res.status(400).json({ message: 'Solo se pueden eliminar cuentas con saldo cero' });
        }
        
        await Cuenta.findByIdAndDelete(id);
        
        res.json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la cuenta', error });
    }
}
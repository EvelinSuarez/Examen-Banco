import Router from "express"
const CuentaRoutes = Router()

import { getCuenta, postCuenta, putconsignarDinero, putretirarDinero, deleteCuenta } from '../controllers/cuentaController.js'

CuentaRoutes.get('/', getCuenta)
CuentaRoutes.post('/', postCuenta)
CuentaRoutes.put('/consignar', putconsignarDinero)
CuentaRoutes.put('/retiro', putretirarDinero)
CuentaRoutes.delete('/:id',deleteCuenta)

export default CuentaRoutes
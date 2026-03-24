import { Router }   from 'express'
import {
  createOrder, getMyPurchases,
  getMySales,  getOrder,
} from '../controllers/orderController.js'
import protect      from '../middleware/auth.js'
import { validateId } from '../middleware/validate.js'

const router = Router()

router.use(protect)

router.post('/',              createOrder)
router.get('/my-purchases',   getMyPurchases)
router.get('/my-sales',       getMySales)
router.get('/:id',            validateId, getOrder)

export default router

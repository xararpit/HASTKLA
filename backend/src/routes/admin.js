import { Router }   from 'express'
import {
  getStats, getAllUsers,
  getAllProducts, approveProduct,
  getAllOrders,  updateOrderStatus,
} from '../controllers/adminController.js'
import protect      from '../middleware/auth.js'
import adminOnly    from '../middleware/admin.js'
import { validateId } from '../middleware/validate.js'

const router = Router()

router.use(protect, adminOnly)

router.get('/stats',                    getStats)
router.get('/users',                    getAllUsers)
router.get('/products',                 getAllProducts)
router.put('/products/:id/approve',     validateId, approveProduct)
router.get('/orders',                   getAllOrders)
router.put('/orders/:id/status',        validateId, updateOrderStatus)

export default router

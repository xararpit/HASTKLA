import { Router }   from 'express'
import {
  getProducts, getProduct,
  createProduct, updateProduct,
  deleteProduct, getMyProducts,
} from '../controllers/productController.js'
import protect      from '../middleware/auth.js'
import { upload }   from '../middleware/upload.js'
import { validateId } from '../middleware/validate.js'

const router = Router()

router.get('/',          getProducts)
router.get('/my',        protect, getMyProducts)
router.get('/:id',       validateId, getProduct)
router.post('/',         protect, upload.array('images', 5), createProduct)
router.put('/:id',       protect, validateId, updateProduct)
router.delete('/:id',    protect, validateId, deleteProduct)

export default router

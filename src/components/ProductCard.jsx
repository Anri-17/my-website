import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import Product3DView from './Product3DView'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="h-64 relative">
        <Product3DView product={product} />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-primary font-bold">${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  )
}

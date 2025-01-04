import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import AdminProductForm from '../components/AdminProductForm'
import { useLanguage } from '../context/LanguageContext'

export default function AdminPage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('products')
  const [loading, setLoading] = useState({
    products: false,
    orders: false,
    users: false
  })

  useEffect(() => {
    if (activeTab === 'products') fetchProducts()
    if (activeTab === 'orders') fetchOrders()
    if (activeTab === 'users') fetchUsers()
  }, [activeTab])

  const fetchProducts = async () => {
    setLoading(prev => ({...prev, products: true}))
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(prev => ({...prev, products: false}))
    }
  }

  const fetchOrders = async () => {
    setLoading(prev => ({...prev, orders: true}))
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false })
      if (!error) setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(prev => ({...prev, orders: false}))
    }
  }

  const fetchUsers = async () => {
    setLoading(prev => ({...prev, users: true}))
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(prev => ({...prev, users: false}))
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      // First delete from auth.users
      await supabase.auth.admin.deleteUser(userId)
      // Then delete from profiles
      await supabase.from('profiles').delete().eq('id', userId)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const renderProductsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">{t('manage_products')}</h2>
      <AdminProductForm 
        product={selectedProduct}
        onSave={() => {
          setSelectedProduct(null)
          fetchProducts()
        }}
      />
      
      <div className="mt-6 space-y-4">
        {loading.products ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">${product.price}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="text-primary hover:text-green-600"
                >
                  {t('edit')}
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  const renderOrdersTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">{t('orders')}</h2>
      {loading.orders ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-medium">#{order.payment_id}</span>
                  <span className="ml-2 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  className={`px-2 py-1 rounded text-sm ${
                    order.status === 'paid' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">{t('customer_details')}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{order.profiles?.full_name || order.customer_details.name}</p>
                    <p>{order.profiles?.email || order.customer_details.email}</p>
                    <p>{order.customer_details.phone}</p>
                    <p>{order.customer_details.address}</p>
                    <p>{order.customer_details.city}, {order.customer_details.zip}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">{t('order_items')}</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>{t('total')}</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderUsersTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">{t('users')}</h2>
      {loading.users ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-medium">{user.full_name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="text-red-500 hover:text-red-600"
              >
                {t('delete')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('admin_panel')}</h1>
      
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2 px-4 ${
            activeTab === 'products'
              ? 'border-b-2 border-primary font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('products')}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 px-4 ${
            activeTab === 'orders'
              ? 'border-b-2 border-primary font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('orders')}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-4 ${
            activeTab === 'users'
              ? 'border-b-2 border-primary font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('users')}
        </button>
      </div>

      {activeTab === 'products' && renderProductsTab()}
      {activeTab === 'orders' && renderOrdersTab()}
      {activeTab === 'users' && renderUsersTab()}
    </div>
  )
}

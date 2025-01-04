import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const { t } = useLanguage()
  const { totalItems } = useCart()

  return (
    <nav className="bg-primary p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-secondary">
          Jassport
        </Link>
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-secondary hover:text-gray-300">
            {t('home')}
          </Link>
          <Link to="/products" className="text-secondary hover:text-gray-300">
            {t('products')}
          </Link>
          <Link to="/contact" className="text-secondary hover:text-gray-300">
            {t('contact')}
          </Link>
          <Link to="/cart" className="relative text-secondary hover:text-gray-300">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to="/account" className="text-secondary hover:text-gray-300">
            👤
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  
  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'ka' : 'en'
    setLanguage(newLanguage)
  }

  return (
    <button
      onClick={handleLanguageChange}
      className="text-secondary hover:text-gray-300"
    >
      {language === 'ka' ? '🇬🇪' : '🇺🇸'}
    </button>
  )
}

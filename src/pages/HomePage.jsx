import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import HeroSection from '../components/HeroSection'
import FeaturedProducts from '../components/FeaturedProducts'

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          {t('featured_products')}
        </h2>
        <FeaturedProducts />
      </div>
    </div>
  )
}

import React from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <div className="relative h-[400px] md:h-[500px] bg-[url('/hero-bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="text-center text-white max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('welcome_to_football_gear')}
          </h1>
          <p className="text-lg mb-8">
            {t('hero_description')}
          </p>
          <a
            href="/products"
            className="bg-primary text-white px-8 py-3 rounded-lg text-lg hover:bg-green-600 transition-colors"
          >
            {t('shop_now')}
          </a>
        </div>
      </div>
    </div>
  )
}

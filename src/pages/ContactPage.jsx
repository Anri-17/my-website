import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../supabaseClient'

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error(t('all_fields_required'))
      }

      // Insert into Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData])

      if (error) throw error

      // Clear form and show success
      setFormData({
        name: '',
        email: '',
        message: ''
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('contact_us')}</h1>
      
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {t('name')}
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              {t('message')}
            </label>
            <textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {t('message_sent_success')}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? t('sending') : t('send_message')}
            </button>
          </div>
        </form>

        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">{t('contact_info')}</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">{t('address')}:</span> 123 Football Street, Tbilisi, Georgia
            </p>
            <p className="text-gray-600">
              <span className="font-medium">{t('phone')}:</span> +995 555 123 456
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> info@footballgear.ge
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

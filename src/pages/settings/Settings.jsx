import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FiSave } from 'react-icons/fi'
import { mockSettings } from '../../data/mockData'
import { getSiteSettings, updateSiteSettings } from '../../services/settingsService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { getAllShipCosts, updateManyShipCost, updateShipCost } from '../../services/logisticsService'

function Settings() {
  const axiosPrivate = useAxiosPrivate();
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchSiteSettings = async () => {
    try {
      setLoading(true)
      const data = await getSiteSettings(axiosPrivate)

      if (data.success) {
        setSettings((prev) => ({
          ...prev,
          site: data.data.result
        }))
      }

    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const fetchShipCostSettings = async () => {
    try {
      setLoading(true)
      const data = await getAllShipCosts(axiosPrivate)

      if (data.success) {
        setSettings((prev) => ({
          ...prev,
          shipping: data.data.result
        }))
      }

    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSiteSettings()
    fetchShipCostSettings()
  }, [])

  const handleChange = (section, field, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value
      }
    })
  }

  const handleShippingMethodChange = (index, field, value) => {
    const updatedMethods = [...settings?.shipping]
    updatedMethods[index] = {
      ...updatedMethods[index],
      [field]: value
    }

    setSettings({
      ...settings,
      shipping: updatedMethods
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const siteData = await updateSiteSettings(axiosPrivate, settings?.site)
      const shippingData = await updateManyShipCost(axiosPrivate, {shipping: settings?.shipping} )

      if (siteData.success && shippingData.success) {
        setSettings((prev) => ({
          ...prev,
          site: siteData.data.result,
          shipping: shippingData.data.result
        }))
        toast.success('Settings saved successfully')
      } else {
        throw new Error('Failed to update settings')
      }

    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsSubmitting(false)
    }
  }

  console.log({ settings })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Error Loading Settings</h2>
        <p className="text-neutral-600">Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Settings</h1>
          <p className="text-neutral-600">Manage your store settings</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            <FiSave className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* site Settings */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">General Settings</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="storeName" className="form-label">
                Store Name
              </label>
              <input
                type="text"
                id="storeName"
                value={settings?.site.storeName}
                onChange={(e) => handleChange('site', 'storeName', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="form-label">
                Store Email
              </label>
              <input
                type="email"
                id="email"
                value={settings?.site.email}
                onChange={(e) => handleChange('site', 'email', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="form-label">
                Store Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={settings?.site.phone}
                onChange={(e) => handleChange('site', 'phone', e.target.value)}
                className="form-input"
              />
            </div>

            {/* <div className="sm:col-span-3">
              <label htmlFor="currencyCode" className="form-label">
                Currency
              </label>
              <select
                id="currencyCode"
                value={settings?.site.currencyCode}
                onChange={(e) => handleChange('site', 'currencyCode', e.target.value)}
                className="form-input"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div> */}

            <div className="sm:col-span-3">
              <label htmlFor="address" className="form-label">
                Store Address
              </label>
              <textarea
                id="address"
                value={settings?.site.address}
                onChange={(e) => handleChange('site', 'address', e.target.value)}
                rows={3}
                className="form-input"
              />
            </div>

            {/* <div className="sm:col-span-2">
              <label htmlFor="taxRate" className="form-label">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                id="taxRate"
                value={settings?.site.taxRate}
                onChange={(e) => handleChange('site', 'taxRate', parseFloat(e.target.value))}
                className="form-input"
              />
            </div> */}

          </div>
        </div>

        {/* Shipping Settings */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Shipping Settings</h2>

          <div className="space-y-6">

            {/* <div className="flex items-center">
              <input
                type="checkbox"
                id="enableFreeShipping"
                checked={settings?.shipping?.enableFreeShipping}
                onChange={(e) => handleChange('shipping', 'enableFreeShipping', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="enableFreeShipping" className="ml-2 block text-sm text-neutral-900">
                Enable free shipping
              </label>
            </div> */}

            {/* {settings?.shipping?.enableFreeShipping && (
              <div className="sm:w-64">
                <label htmlFor="freeShippingThreshold" className="form-label">
                  Free Shipping Threshold
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="freeShippingThreshold"
                    value={settings?.shipping?.freeShippingThreshold}
                    onChange={(e) => handleChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                    className="form-input pl-7"
                  />
                </div>
              </div>
            )} */}

            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Shipping Methods</h3>
              <div className="space-y-4">
                {settings?.shipping?.map((method, index) => (
                  <div key={method._id} className="card p-4 bg-neutral-50">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          value={method?.deliveryType}
                          onChange={(e) => handleShippingMethodChange(index, 'deliveryType', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label className="form-label">Price</label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-neutral-500 sm:text-sm">₹</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={method.amount}
                            onChange={(e) => handleShippingMethodChange(index, 'amount', parseFloat(e.target.value))}
                            className="form-input pl-7"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Estimated Days</label>
                        <input
                          type="text"
                          value={method.duration}
                          onChange={(e) => handleShippingMethodChange(index, 'duration', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Settings */}

        {/* <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Payment Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enablePayPal"
                checked={settings?.payment.enablePayPal}
                onChange={(e) => handleChange('payment', 'enablePayPal', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="enablePayPal" className="ml-2 block text-sm text-neutral-900">
                Enable PayPal
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableCreditCard"
                checked={settings?.payment.enableCreditCard}
                onChange={(e) => handleChange('payment', 'enableCreditCard', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="enableCreditCard" className="ml-2 block text-sm text-neutral-900">
                Enable Credit Card
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableApplePay"
                checked={settings?.payment.enableApplePay}
                onChange={(e) => handleChange('payment', 'enableApplePay', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="enableApplePay" className="ml-2 block text-sm text-neutral-900">
                Enable Apple Pay
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableGooglePay"
                checked={settings?.payment.enableGooglePay}
                onChange={(e) => handleChange('payment', 'enableGooglePay', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="enableGooglePay" className="ml-2 block text-sm text-neutral-900">
                Enable Google Pay
              </label>
            </div>
          </div>
        </div> */}

        {/* Email Settings */}

        {/* <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Email Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="orderConfirmation"
                checked={settings?.email.orderConfirmation}
                onChange={(e) => handleChange('email', 'orderConfirmation', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="orderConfirmation" className="ml-2 block text-sm text-neutral-900">
                Send order confirmation emails
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="orderShipped"
                checked={settings?.email.orderShipped}
                onChange={(e) => handleChange('email', 'orderShipped', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="orderShipped" className="ml-2 block text-sm text-neutral-900">
                Send order shipped emails
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="orderDelivered"
                checked={settings?.email.orderDelivered}
                onChange={(e) => handleChange('email', 'orderDelivered', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="orderDelivered" className="ml-2 block text-sm text-neutral-900">
                Send order delivered emails
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="abandonedCart"
                checked={settings?.email.abandonedCart}
                onChange={(e) => handleChange('email', 'abandonedCart', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="abandonedCart" className="ml-2 block text-sm text-neutral-900">
                Send abandoned cart reminders
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="welcomeEmail"
                checked={settings?.email.welcomeEmail}
                onChange={(e) => handleChange('email', 'welcomeEmail', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="welcomeEmail" className="ml-2 block text-sm text-neutral-900">
                Send welcome emails to new customers
              </label>
            </div>
          </div>
        </div> */}


        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            <FiSave className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings
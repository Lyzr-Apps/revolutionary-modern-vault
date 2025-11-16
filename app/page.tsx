'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertCircle, CheckCircle, Mail, Users, Building2, Calendar, MapPin, Phone } from 'lucide-react'

type RegistrationType = 'attendee' | 'business' | null
type PageView = 'registration' | 'confirmation' | 'dashboard'

interface AttendeeRegistration {
  id: string
  type: 'attendee'
  fullName: string
  email: string
  contactNumber: string
  emergencyContact: string
  registrationDate: string
  emailStatus: 'sent' | 'failed' | 'pending'
}

interface BusinessRegistration {
  id: string
  type: 'business'
  businessName: string
  contactPerson: string
  email: string
  phone: string
  businessCategory: string
  staffCount: string
  registrationDate: string
  emailStatus: 'sent' | 'failed' | 'pending'
}

type Registration = AttendeeRegistration | BusinessRegistration

const BUSINESS_CATEGORIES = [
  'Technology',
  'Food & Beverage',
  'Fashion & Retail',
  'Health & Wellness',
  'Education',
  'Finance',
  'Entertainment',
  'Travel & Tourism',
  'Sports & Recreation',
  'Other'
]

const SAMPLE_REGISTRATIONS: Registration[] = [
  {
    id: 'REG-001',
    type: 'attendee',
    fullName: 'John Doe',
    email: 'john@example.com',
    contactNumber: '+1-555-0101',
    emergencyContact: 'Jane Doe',
    registrationDate: '2025-01-15',
    emailStatus: 'sent'
  },
  {
    id: 'REG-002',
    type: 'business',
    businessName: 'TechCorp Solutions',
    contactPerson: 'Alice Johnson',
    email: 'alice@techcorp.com',
    phone: '+1-555-0102',
    businessCategory: 'Technology',
    staffCount: '5',
    registrationDate: '2025-01-14',
    emailStatus: 'sent'
  },
  {
    id: 'REG-003',
    type: 'attendee',
    fullName: 'Sarah Smith',
    email: 'sarah@example.com',
    contactNumber: '+1-555-0103',
    emergencyContact: 'Mike Smith',
    registrationDate: '2025-01-13',
    emailStatus: 'sent'
  },
  {
    id: 'REG-004',
    type: 'business',
    businessName: 'Delicious Eats Catering',
    contactPerson: 'Bob Wilson',
    email: 'bob@deliciouseats.com',
    phone: '+1-555-0104',
    businessCategory: 'Food & Beverage',
    staffCount: '8',
    registrationDate: '2025-01-12',
    emailStatus: 'pending'
  }
]

interface FormData {
  registrationType: RegistrationType
  fullName: string
  email: string
  contactNumber: string
  emergencyContact: string
  businessName: string
  contactPerson: string
  phone: string
  businessCategory: string
  staffCount: string
}

interface FormErrors {
  [key: string]: string
}

function SetupInstructions() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <p className="font-semibold mb-2">Email Setup Required</p>
        <p className="text-sm mb-3">To send confirmation emails to your inbox, add these environment variables to <code className="bg-white px-2 py-1 rounded text-xs">.env.local</code>:</p>
        <div className="bg-white p-3 rounded text-xs font-mono mb-3 border border-amber-200 overflow-x-auto">
          GMAIL_USER=your-email@gmail.com<br/>
          GMAIL_PASSWORD=your-app-password
        </div>
        <p className="text-sm mb-2">
          For Gmail accounts with 2FA enabled, use an <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="underline text-amber-700 hover:text-amber-900">App Password</a> instead of your regular password.
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-xs underline text-amber-700 hover:text-amber-900 mt-2"
        >
          Dismiss
        </button>
      </AlertDescription>
    </Alert>
  )
}

export default function EventRegistrationPage() {
  const [currentPage, setCurrentPage] = useState<PageView>('registration')
  const [registrationType, setRegistrationType] = useState<RegistrationType>(null)
  const [formData, setFormData] = useState<FormData>({
    registrationType: null,
    fullName: '',
    email: '',
    contactNumber: '',
    emergencyContact: '',
    businessName: '',
    contactPerson: '',
    phone: '',
    businessCategory: '',
    staffCount: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [lastRegistration, setLastRegistration] = useState<Registration | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>(SAMPLE_REGISTRATIONS)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (registrationType === 'attendee') {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format'
      if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required'
      if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required'
    } else if (registrationType === 'business') {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
      if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!formData.businessCategory) newErrors.businessCategory = 'Business category is required'
      if (!formData.staffCount.trim()) newErrors.staffCount = 'Expected staff count is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const sendConfirmationEmail = async (registration: Registration) => {
    try {
      const registrationData =
        registration.type === 'attendee'
          ? {
              registrationId: registration.id,
              fullName: registration.fullName,
              email: registration.email,
              contactNumber: registration.contactNumber,
              emergencyContact: registration.emergencyContact,
            }
          : {
              registrationId: registration.id,
              businessName: registration.businessName,
              contactPerson: registration.contactPerson,
              email: registration.email,
              phone: registration.phone,
              businessCategory: registration.businessCategory,
              staffCount: registration.staffCount,
            }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: registration.email,
          registrationType: registration.type,
          registrationData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const updatedRegistrations = registrations.map((reg) =>
          reg.id === registration.id ? { ...reg, emailStatus: 'sent' as const } : reg
        )
        setRegistrations(updatedRegistrations)
        return true
      } else {
        console.error('Email sending failed:', data.error)
        return false
      }
    } catch (error) {
      console.error('Email error:', error)
      return false
    }
  }

  const triggerEmailAgent = async (registration: Registration) => {
    try {
      const agentId = registration.type === 'attendee' ? '69199ff81034d49d53cbf668' : '6919a0201034d49d53cbf66a'

      const messageContent =
        registration.type === 'attendee'
          ? `Generate personalized event ticket for attendee: ${registration.fullName}, Email: ${registration.email}, Registration ID: ${registration.id}`
          : `Compile business participation package for business: ${registration.businessName}, Contact: ${registration.contactPerson}, Email: ${registration.email}, Category: ${registration.businessCategory}, Staff: ${registration.staffCount}, Registration ID: ${registration.id}`

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          agent_id: agentId
        })
      })

      const data = await response.json()

      if (data.success) {
        // Send confirmation email after agent response
        await sendConfirmationEmail(registration)
        return true
      }
      return false
    } catch (error) {
      console.error('Agent error:', error)
      return false
    }
  }

  const handleTypeSelect = (type: RegistrationType) => {
    setRegistrationType(type)
    setFormData({
      ...formData,
      registrationType: type,
      fullName: '',
      email: '',
      contactNumber: '',
      emergencyContact: '',
      businessName: '',
      contactPerson: '',
      phone: '',
      businessCategory: '',
      staffCount: ''
    })
    setErrors({})
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    })
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const registrationId = `REG-${String(registrations.length + 1).padStart(3, '0')}`

      let newRegistration: Registration
      if (registrationType === 'attendee') {
        newRegistration = {
          id: registrationId,
          type: 'attendee',
          fullName: formData.fullName,
          email: formData.email,
          contactNumber: formData.contactNumber,
          emergencyContact: formData.emergencyContact,
          registrationDate: new Date().toISOString().split('T')[0],
          emailStatus: 'pending'
        }
      } else {
        newRegistration = {
          id: registrationId,
          type: 'business',
          businessName: formData.businessName,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          businessCategory: formData.businessCategory,
          staffCount: formData.staffCount,
          registrationDate: new Date().toISOString().split('T')[0],
          emailStatus: 'pending'
        }
      }

      setRegistrations([...registrations, newRegistration])
      setLastRegistration(newRegistration)

      await triggerEmailAgent(newRegistration)

      setCurrentPage('confirmation')
      setShowConfirmModal(true)

      setTimeout(() => {
        setShowConfirmModal(false)
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async (registration: Registration) => {
    const updated = { ...registration, emailStatus: 'pending' as const }
    const success = await triggerEmailAgent(updated)
    if (!success) {
      const updatedRegistrations = registrations.map((reg) =>
        reg.id === registration.id ? { ...reg, emailStatus: 'failed' as const } : reg
      )
      setRegistrations(updatedRegistrations)
    }
  }

  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEmailStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4" />
      case 'failed':
        return <AlertCircle className="w-4 h-4" />
      case 'pending':
        return <Mail className="w-4 h-4" />
      default:
        return null
    }
  }

  const stats = {
    total: registrations.length,
    attendees: registrations.filter((r) => r.type === 'attendee').length,
    businesses: registrations.filter((r) => r.type === 'business').length,
    emailsSent: registrations.filter((r) => r.emailStatus === 'sent').length
  }

  const successRate =
    stats.total > 0 ? Math.round((stats.emailsSent / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">Event Registration System</h1>
            </div>
            <nav className="flex gap-4">
              <button
                onClick={() => setCurrentPage('registration')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'registration'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'registration' && <SetupInstructions />}
        {currentPage === 'registration' && (
          <div className="max-w-2xl mx-auto">
            {/* Registration Type Selector */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Select Registration Type</CardTitle>
                <CardDescription>Choose how you'd like to register for our event</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={registrationType || ''} onValueChange={(v) => handleTypeSelect(v as RegistrationType)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Attendee Option */}
                    <div
                      onClick={() => handleTypeSelect('attendee')}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        registrationType === 'attendee'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="attendee" id="attendee" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="attendee" className="cursor-pointer font-semibold text-slate-900 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Individual Attendee
                          </Label>
                          <p className="text-sm text-slate-600 mt-1">Register as an event attendee and receive a personalized ticket</p>
                        </div>
                      </div>
                    </div>

                    {/* Business Option */}
                    <div
                      onClick={() => handleTypeSelect('business')}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        registrationType === 'business'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="business" id="business" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="business" className="cursor-pointer font-semibold text-slate-900 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Business Vendor
                          </Label>
                          <p className="text-sm text-slate-600 mt-1">Register your business and receive stall information and setup guidelines</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Attendee Registration Form */}
            {registrationType === 'attendee' && (
              <Card>
                <CardHeader>
                  <CardTitle>Attendee Registration</CardTitle>
                  <CardDescription>Please fill in your details to complete registration</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="fullName" className="font-medium text-slate-700">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`mt-2 ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className="font-medium text-slate-700">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`mt-2 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="contactNumber" className="font-medium text-slate-700">
                        Contact Number
                      </Label>
                      <Input
                        id="contactNumber"
                        placeholder="+1-555-0000"
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                        className={`mt-2 ${errors.contactNumber ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.contactNumber && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.contactNumber}</p>}
                    </div>

                    <div>
                      <Label htmlFor="emergencyContact" className="font-medium text-slate-700">
                        Emergency Contact Name
                      </Label>
                      <Input
                        id="emergencyContact"
                        placeholder="Emergency contact person name"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className={`mt-2 ${errors.emergencyContact ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.emergencyContact && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.emergencyContact}</p>}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-10"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Complete Registration'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Business Registration Form */}
            {registrationType === 'business' && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Registration</CardTitle>
                  <CardDescription>Please fill in your business details to complete registration</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="businessName" className="font-medium text-slate-700">
                        Business Name
                      </Label>
                      <Input
                        id="businessName"
                        placeholder="Enter your business name"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className={`mt-2 ${errors.businessName ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.businessName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.businessName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="contactPerson" className="font-medium text-slate-700">
                        Contact Person Name
                      </Label>
                      <Input
                        id="contactPerson"
                        placeholder="Name of your contact person"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        className={`mt-2 ${errors.contactPerson ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.contactPerson && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.contactPerson}</p>}
                    </div>

                    <div>
                      <Label htmlFor="businessEmail" className="font-medium text-slate-700">
                        Email Address
                      </Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        placeholder="business@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`mt-2 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="font-medium text-slate-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+1-555-0000"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`mt-2 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="businessCategory" className="font-medium text-slate-700">
                        Business Category
                      </Label>
                      <Select value={formData.businessCategory} onValueChange={(v) => handleInputChange('businessCategory', v)}>
                        <SelectTrigger className={`mt-2 ${errors.businessCategory ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.businessCategory && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.businessCategory}</p>}
                    </div>

                    <div>
                      <Label htmlFor="staffCount" className="font-medium text-slate-700">
                        Expected Number of Stall Staff
                      </Label>
                      <Input
                        id="staffCount"
                        type="number"
                        min="1"
                        placeholder="Enter number of staff"
                        value={formData.staffCount}
                        onChange={(e) => handleInputChange('staffCount', e.target.value)}
                        className={`mt-2 ${errors.staffCount ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.staffCount && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.staffCount}</p>}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-10"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Complete Registration'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {!registrationType && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-slate-600 text-center">Select a registration type above to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentPage === 'confirmation' && lastRegistration && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-8">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful</h2>
                  <p className="text-slate-600 mb-6">Your registration has been processed successfully</p>

                  <div className="bg-white rounded-lg p-6 mb-6 text-left space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Registration ID:</span>
                      <span className="font-semibold text-slate-900">{lastRegistration.id}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                      <span className="text-slate-600">
                        {lastRegistration.type === 'attendee' ? 'Attendee Name:' : 'Business Name:'}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {lastRegistration.type === 'attendee'
                          ? lastRegistration.fullName
                          : lastRegistration.businessName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Email:</span>
                      <span className="font-semibold text-slate-900">{lastRegistration.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Type:</span>
                      <Badge className="bg-blue-100 text-blue-800 capitalize">{lastRegistration.type}</Badge>
                    </div>
                  </div>

                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">Confirmation Email Sent</p>
                        <p className="text-sm text-slate-700 mt-1">
                          A confirmation email has been sent to <span className="font-semibold">{lastRegistration.email}</span>
                        </p>
                        <p className="text-sm text-slate-700 mt-1">
                          {lastRegistration.type === 'attendee'
                            ? 'Check your email for your personalized event ticket.'
                            : 'Check your email for stall information and participation guidelines.'}
                        </p>
                        <p className="text-xs text-slate-600 mt-2">Expected delivery: 1-2 minutes</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setCurrentPage('registration')
                        setRegistrationType(null)
                        setFormData({
                          registrationType: null,
                          fullName: '',
                          email: '',
                          contactNumber: '',
                          emergencyContact: '',
                          businessName: '',
                          contactPerson: '',
                          phone: '',
                          businessCategory: '',
                          staffCount: ''
                        })
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-10"
                    >
                      New Registration
                    </Button>
                    <Button
                      onClick={() => setCurrentPage('dashboard')}
                      variant="outline"
                      className="w-full border-slate-300"
                    >
                      View Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentPage === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-slate-600 text-sm mb-1">Total Registrations</p>
                    <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-slate-600 text-sm mb-1">Attendees</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.attendees}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-slate-600 text-sm mb-1">Businesses</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.businesses}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-slate-600 text-sm mb-1">Email Success Rate</p>
                    <p className="text-3xl font-bold text-green-600">{successRate}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registrations Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Registrations</CardTitle>
                <CardDescription>View and manage all event registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Name / Business</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Email Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-slate-900 font-medium">{reg.id}</td>
                          <td className="py-3 px-4 text-slate-900">
                            {reg.type === 'attendee' ? reg.fullName : reg.businessName}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="capitalize bg-blue-100 text-blue-800">{reg.type}</Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{reg.email}</td>
                          <td className="py-3 px-4 text-slate-600">{reg.registrationDate}</td>
                          <td className="py-3 px-4">
                            <Badge className={`capitalize flex items-center gap-1 w-fit ${getEmailStatusColor(reg.emailStatus)}`}>
                              {getEmailStatusIcon(reg.emailStatus)}
                              {reg.emailStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {reg.emailStatus !== 'sent' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResendEmail(reg)}
                                className="text-xs"
                              >
                                Resend
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Registration Submitted
            </DialogTitle>
            <DialogDescription>Sending confirmation email with {lastRegistration?.type === 'attendee' ? 'ticket' : 'business package'}...</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600 text-center">
              This modal will close automatically. You will be redirected to the confirmation page.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

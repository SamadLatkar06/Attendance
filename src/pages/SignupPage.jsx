import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, BookOpen } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import { useAuth } from '../hooks/useAuth'
import {
  validateEmail,
  validatePassword,
  validateName,
  validateEnrollmentNumber,
} from '../utils/validation'
import toast from 'react-hot-toast'

const SignupPage = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState('student')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    enrollmentNumber: '',
    department: '',
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!validateName(formData.name)) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (userType === 'student' && !validateEnrollmentNumber(formData.enrollmentNumber)) {
      newErrors.enrollmentNumber = 'Enrollment number is required'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        role: userType,
        enrollment_number: userType === 'student' ? formData.enrollmentNumber : null,
        department: formData.department || null,
      })
      toast.success('Account created successfully. Please log in.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary-500 mb-2">Create Account</h1>
          <p className="text-gray-400">Join GeoAttend</p>
        </div>

        <div className="flex gap-3 mb-6">
          {['student', 'teacher'].map((type) => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                userType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon={User}
          />

          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
          />

          {userType === 'student' && (
            <Input
              type="text"
              name="enrollmentNumber"
              label="Enrollment Number"
              placeholder="BEE001"
              value={formData.enrollmentNumber}
              onChange={handleChange}
              error={errors.enrollmentNumber}
              icon={BookOpen}
            />
          )}

          <Input
            type="text"
            name="department"
            label="Department (Optional)"
            placeholder="Computer Science"
            value={formData.department}
            onChange={handleChange}
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={Lock}
          />

          <Button type="submit" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default SignupPage

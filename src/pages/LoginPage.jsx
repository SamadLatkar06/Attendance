import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validatePassword } from '../utils/validation'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters'
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
      await login(formData.email, formData.password)
      toast.success('Login successful')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-500 mb-2">GeoAttend</h1>
          <p className="text-gray-400">Smart Attendance System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-500 hover:text-primary-400 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage

import { useState } from 'react'
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Alert from '../components/Alert'
import { validatePassword } from '../utils/validation'

const PasswordVerificationModal = ({ onVerify, onCancel, loading = false }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Password is required')
      return
    }

    if (!validatePassword(password)) {
      setError('Invalid password format')
      return
    }

    try {
      await onVerify(password)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Verify Password</h2>
          <p className="text-gray-400 text-sm">Enter your password to mark manual attendance</p>
        </div>

        {error && <Alert type="error" title="Error" message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError('')
            }}
            icon={Lock}
          />

          <div className="flex gap-3">
            <Button onClick={onCancel} variant="secondary" fullWidth disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={loading}>
              Verify
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default PasswordVerificationModal

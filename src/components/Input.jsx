import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Input = ({
  type = 'text',
  label,
  error,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />}
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          className={`w-full px-4 py-2.5 ${Icon ? 'pl-10' : ''} bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default Input

import { GitBranch } from 'lucide-react'

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-primary-500/20 text-primary-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    gray: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge

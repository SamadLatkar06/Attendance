const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2'

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-dark-700 hover:bg-dark-600 text-gray-100 border border-dark-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'text-primary-500 hover:bg-dark-800',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const width = fullWidth ? 'w-full' : ''
  const opacity = disabled || loading ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${width} ${opacity} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="inline-block animate-spin">⟳</span> : null}
      {children}
    </button>
  )
}

export default Button

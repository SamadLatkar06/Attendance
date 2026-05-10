const Card = ({ children, className = '', onClick = null }) => {
  return (
    <div
      className={`bg-dark-800 rounded-xl p-6 border border-dark-700 transition-all duration-300 hover:border-primary-500 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md px-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton h-12 rounded-lg"></div>
        ))}
      </div>
    </div>
  )
}

export default LoadingSkeleton

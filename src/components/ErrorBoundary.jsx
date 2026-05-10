import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unexpected application error' }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 text-gray-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-dark-800 border border-dark-700 rounded-xl p-6 text-center">
            <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-400 mb-5">{this.state.message}</p>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Reload app
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

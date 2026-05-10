import { AlertCircle } from 'lucide-react'
import Card from './Card'

const ErrorAlert = ({ title = 'Error', message, onDismiss = null }) => {
  return (
    <Card className="border-l-4 border-l-red-500 bg-red-500/10">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
        <div className="flex-1">
          {title && <h3 className="font-semibold text-red-500 mb-1">{title}</h3>}
          <p className="text-sm text-red-400">{message}</p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-red-500 hover:text-red-400 text-lg">
            ×
          </button>
        )}
      </div>
    </Card>
  )
}

export default ErrorAlert

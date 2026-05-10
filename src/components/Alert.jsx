import { CheckCircle, AlertCircle, Info } from 'lucide-react'
import Card from './Card'

const Alert = ({ type = 'info', title, message, onDismiss = null }) => {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-l-green-500',
      textColor: 'text-green-400',
      titleColor: 'text-green-500',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-l-red-500',
      textColor: 'text-red-400',
      titleColor: 'text-red-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-l-blue-500',
      textColor: 'text-blue-400',
      titleColor: 'text-blue-500',
    },
  }

  const config = typeConfig[type] || typeConfig.info
  const Icon = config.icon

  return (
    <Card className={`border-l-4 ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.titleColor} mt-1 flex-shrink-0`} />
        <div className="flex-1">
          {title && <h3 className={`font-semibold ${config.titleColor} mb-1`}>{title}</h3>}
          <p className={`text-sm ${config.textColor}`}>{message}</p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-gray-500 hover:text-gray-400 text-lg">
            ×
          </button>
        )}
      </div>
    </Card>
  )
}

export default Alert

import React from 'react'

import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid'

const JobStatus = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'failed':
        return {
          color: 'bg-red-100',
          Icon: ExclamationTriangleIcon,
          iconColor: 'text-red-500',
        }
      case 'running':
        return {
          color: 'bg-blue-100',
          Icon: ArrowPathIcon,
          iconColor: 'text-blue-500',
        }
      case 'scheduled':
        return {
          color: 'bg-yellow-100',
          Icon: ClockIcon,
          iconColor: 'text-yellow-500',
        }
      case 'done':
      default:
        return {
          color: 'bg-green-100',
          Icon: CheckCircleIcon,
          iconColor: 'text-green-500',
        }
    }
  }

  const { color, Icon, iconColor } = getStatusConfig(status)

  return (
    <div className={`rounded-full p-2 ${color} flex items-center gap-1`}>
      <Icon className={`h-5 w-5 ${iconColor}`} />
      <span className={`text-sm font-medium ${iconColor}`}>{status}</span>
    </div>
  )
}

export default JobStatus

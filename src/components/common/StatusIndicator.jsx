import React from 'react'

const StatusIndicator = ({kind, value}) => {
  return (
    <div>
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            kind === 'archive'
                ? value
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
        >
            {kind === 'archive' ? (value ? 'Archived' : 'Active') : 'Unknown'}
        </span>
    </div>
  )
}

export default StatusIndicator
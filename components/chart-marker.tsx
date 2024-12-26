export function ChartMarker({ type }: { type: 'current' | 'end' }) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-gray-400 text-sm mb-1">{type === 'current' ? 'Current' : 'End'}</span>
        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6L0 0H12L6 6Z" fill="rgba(255, 255, 255, 0.4)" />
        </svg>
      </div>
    )
  }
  
  
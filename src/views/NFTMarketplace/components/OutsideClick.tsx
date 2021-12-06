import React, { useEffect, useRef } from 'react'

const OutsideClick: React.FC<{ onClick: () => void; as: React.ReactElement }> = ({ onClick, as }) => {
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent): void => {
      e.stopPropagation()
      if (!(ref.current as unknown as HTMLElement)?.contains(e.target as Node)) {
        onClick()
      }
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [ref, onClick])

  return React.cloneElement(as, { ref })
}

export default OutsideClick

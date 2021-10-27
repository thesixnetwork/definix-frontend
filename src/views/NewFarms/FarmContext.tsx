import React, { createContext } from 'react'

interface ModalsContext {
  onPresent: (
    node: React.ReactNode,
    {
      title,
      description,
    }: {
      title: string
      description: string
    },
  ) => void
  onDismiss: () => void
}

const FarmContext = createContext<ModalsContext>({
  onPresent: () => null,
  onDismiss: () => null,
})

export default FarmContext

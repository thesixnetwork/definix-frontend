import { useCallback } from 'react'

const useToFixedFloor = (decimals: number) => {
  return useCallback(
    (input: string) => {
      const [integer, decimal] = input?.split('.') || ['0']
      if (decimal?.length > decimals) {
        const calDecimal = decimal.substring(0, decimals)?.replace(/0*$/, '')
        return [integer, calDecimal].join('.')
      }
      return input
    },
    [decimals],
  )
}

export default useToFixedFloor

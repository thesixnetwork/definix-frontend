import { useSelector } from 'react-redux'
import { AppState } from '../index'
import useWallet from 'hooks/useWallet'

export function useBlockNumber(): number | undefined {
  const { chainId } = useWallet()
  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

export function useGasPrice(): string {
  return useSelector((state: AppState) => state.application.gasPrice)
}

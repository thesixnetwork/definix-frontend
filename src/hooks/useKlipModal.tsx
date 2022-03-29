import dayjs from 'dayjs'
import KlipModal from '../components/KlipModal'
import { useModal } from '@fingerlabs/definixswap-uikit-v2'

const useKlipModal = () => {
  return useModal(<KlipModal />)
}

export const renderKlipTimeFormat = (time: number) => {
  const expireDuration = dayjs(time)
  return `
    ${expireDuration.minute()} : ${expireDuration.second()}
  `
}

export default useKlipModal

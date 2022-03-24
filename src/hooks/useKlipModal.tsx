import dayjs from 'dayjs'
import KlipModal from '../components/KlipModal'
import { useModal } from '@fingerlabs/definixswap-uikit-v2'

const useKlipModal = (props?: { onHide: () => void }) => {
  return useModal(<KlipModal {...(props || {})} />)
}

export const renderKlipTimeFormat = (time: number) => {
  const expireDuration = dayjs(time)
  return `
    ${expireDuration.minute()} min ${expireDuration.second()} sec
  `
}

export default useKlipModal

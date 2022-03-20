import KlipModal from '../components/KlipModal'
import { useModal } from '@fingerlabs/definixswap-uikit-v2'

const useKlipModal = (props: {
  onHide: () => void;
}) => {
  return useModal(<KlipModal {...props} />)
}

export default useKlipModal;

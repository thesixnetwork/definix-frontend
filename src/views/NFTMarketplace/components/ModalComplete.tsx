
import React, { useCallback, useMemo, useState } from 'react'
import Lottie from 'react-lottie'
import success from 'uikit-dev/animation/complete.json'
import { Modal } from 'uikit-dev'
import loading from 'uikit-dev/animation/farmPool.json'
import useI18n from '../../../hooks/useI18n'

const options = {
    loop: true,
    autoplay: true,
    animationData: loading,
}

const SuccessOptions = {
    loop: true,
    autoplay: true,
    animationData: success,
}

interface ModalCompleteProps {
    onDismiss?: () => void
}

const ModalComplete: React.FC<ModalCompleteProps> = ({
    onDismiss = () => null,
}) => {
    const [val, setVal] = useState('')
    const [pendingTx, setPendingTx] = useState(false)
    const TranslateString = useI18n()

    return (
        <Modal
            title=""
            onDismiss={onDismiss}
            isRainbow={false}
            bodyPadding="100px 150px"
            hideCloseButton
            classHeader="bd-b-n"
        >
            {pendingTx ? <Lottie options={options} height={164} width={164} /> :  <Lottie options={SuccessOptions} height={164} width={164} />}
        </Modal>
    )
}

export default ModalComplete

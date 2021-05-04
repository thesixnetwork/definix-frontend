import React from 'react'
import Button from '../../components/Button/Button'
import Text from '../../components/Text/Text'
import { localStorageKey } from './config'
import { Config } from './types'
import Kaikas from './icons/Kaikas.png'

interface Props {
  walletConfig: Config
  login: () => void
  onDismiss: () => void
  mb: string
}

const WalletKaikasCard: React.FC<Props> = ({ login, walletConfig, onDismiss, mb }) => {
  const { title } = walletConfig
  return (
    <Button
      fullWidth
      variant="tertiary"
      onClick={() => {
        login()
        window.localStorage.setItem(localStorageKey, '1')
        onDismiss()
      }}
      style={{ justifyContent: 'space-between' }}
      mb={mb}
      id={`wallet-connect-${title.toLocaleLowerCase()}`}
    >
      <Text bold color="primary" mr="16px">
        {title}
      </Text>
      <img src={Kaikas} alt="" width="32" className="mr-2" />
    </Button>
  )
}

export default WalletKaikasCard

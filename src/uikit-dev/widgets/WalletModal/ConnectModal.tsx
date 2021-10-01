import React from 'react'
import styled from 'styled-components'
import { Link } from '../../components/Link'
// import { HelpIcon } from '../../components/Svg'
import { Modal } from '../Modal'
import WalletCard from './WalletCard'
import config from './config'
import { Login } from './types'
import { Text } from '../../components/Text'

interface Props {
  login: Login
  onDismiss?: () => void
}

// const HelpLink = styled(Link)`
//   display: flex;
//   align-self: center;
//   align-items: center;
//   margin-top: 24px;
// `

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const ConnectModal: React.FC<Props> = ({ login, onDismiss = () => null }) => (
  <Modal title="Connect to a wallet" onDismiss={onDismiss} isRainbow={false}>
    {config.map((entry, index) => (
      <WalletCard
        key={entry.title}
        login={login}
        walletConfig={entry}
        onDismiss={onDismiss}
        mb={index < config.length - 1 ? '8px' : '0'}
      />
    ))}
    <div className="mt-3 flex align-center justify-center">
      <Text paddingRight="1">I’m new to this,</Text>
      <TutorailsLink
        href="https://sixnetwork.gitbook.io/definix-on-klaytn-en/guides-and-faqs/how-to-use-kaikas-on-definix"
        target="_blank"
      >
        How to set up.
      </TutorailsLink>
    </div>
    {/* <HelpLink
      href="https://docs.definixswap.finance/guides/faq#how-do-i-set-up-my-wallet-on-binance-smart-chain"
      external
    >
      <HelpIcon color="primary" mr="6px" />
      Learn how to connect
    </HelpLink> */}
  </Modal>
)

export default ConnectModal

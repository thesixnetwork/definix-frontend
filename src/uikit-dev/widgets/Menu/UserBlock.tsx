import React from 'react'
import styled from 'styled-components'
import Button from '../../components/Button/Button'
import Dropdown from '../../components/Dropdown/Dropdown'
import Heading from '../../components/Heading/Heading'
import LinkExternal from '../../components/Link/LinkExternal'
import Text from '../../components/Text/Text'
import { useWalletModal } from '../WalletModal'
import { localStorageKey } from '../WalletModal/config'
import CopyToClipboard from '../WalletModal/CopyToClipboard'
import { Login } from '../WalletModal/types'

interface Props {
  account?: string
  login: Login
  logout: () => void
  className?: string
}

const ConnectButton = styled(Button)`
  padding: 4px !important;
  box-shadow: ${({ theme }) => theme.shadows.elevation1} !important;
  background: ${({ theme }) => theme.colors.connectBtnBorder} !important;

  > div {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.radii.large};
    padding: 0 16px;
    display: block;
    height: 24px;
    line-height: 24px;
  }
`

const AccountButton = styled(ConnectButton)`
  > div {
    background: ${({ theme }) => theme.colors.connectBtnInner};
  }
`

const UserBlock: React.FC<Props> = ({ account, login, logout, className = '' }) => {
  const { onPresentConnectModal } = useWalletModal(login, logout, account)
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null

  return (
    <div className={className}>
      {account ? (
        <Dropdown
          position="bottom-right"
          isRainbow={false}
          target={
            <AccountButton
              size="sm"
              fullWidth
              variant="text"
              className="connect-btn"
              // onClick={() => {
              //   onPresentAccountModal()
              // }}
            >
              <Text fontSize="12px" color="white" fontWeight="600">
                {accountEllipsis}
              </Text>
            </AccountButton>
          }
        >
          <div style={{ zIndex: 999 }}>
            <Heading fontSize="16px !important" className="mb-3 pa-0 pt-2">
              {accountEllipsis}
            </Heading>
            <LinkExternal
              isIconLeft
              small
              href={`https://bscscan.com/address/${account}`}
              className="mb-2"
              fontSize="13px"
            >
              View on BscScan
            </LinkExternal>
            <CopyToClipboard noPadding toCopy={account}>
              Copy Address
            </CopyToClipboard>
            <Button
              size="sm"
              variant="secondary"
              fullWidth
              className="mt-4"
              onClick={() => {
                logout()
                window.localStorage.removeItem(localStorageKey)
                window.location.reload()
              }}
            >
              Disconnect
            </Button>
          </div>
        </Dropdown>
      ) : (
        <ConnectButton
          size="sm"
          fullWidth
          variant="text"
          className="connect-btn"
          onClick={() => {
            onPresentConnectModal()
          }}
        >
          <Text fontSize="12px" color="white" fontWeight="600">
            Connect wallet
          </Text>
        </ConnectButton>
      )}
    </div>
  )
}

export default UserBlock

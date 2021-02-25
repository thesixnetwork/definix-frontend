import React from 'react'
import Heading from '../../components/Heading/Heading'
import Button from '../../components/Button/Button'
import Dropdown from '../../components/Dropdown/Dropdown'
import LinkExternal from '../../components/Link/LinkExternal'
import { useWalletModal } from '../WalletModal'
import { localStorageKey } from '../WalletModal/config'
import CopyToClipboard from '../WalletModal/CopyToClipboard'
import { Login } from '../WalletModal/types'

interface Props {
  account?: string
  login: Login
  logout: () => void
}

const UserBlock: React.FC<Props> = ({ account, login, logout }) => {
  const { onPresentConnectModal } = useWalletModal(login, logout, account)
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
  const accountEllipsisLong = account ? `${account.substring(0, 12)}...${account.substring(account.length - 12)}` : null

  return (
    <div>
      {account ? (
        <Dropdown
          position="bottom-right"
          isRainbow
          target={
            <Button
              size="sm"
              variant="tertiary"
              // onClick={() => {
              //   onPresentAccountModal()
              // }}
            >
              {accountEllipsis}
            </Button>
          }
        >
          <div className="pa-2">
            <Heading className="mb-4">{accountEllipsisLong}</Heading>
            <LinkExternal isIconLeft small href={`https://bscscan.com/address/${account}`} className="mb-2">
              View on Klaytnscope
            </LinkExternal>
            <CopyToClipboard toCopy={account}>Copy Address</CopyToClipboard>
            <Button
              size="sm"
              variant="secondary"
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
        <Button
          size="sm"
          onClick={() => {
            onPresentConnectModal()
          }}
        >
          Connect
        </Button>
      )}
    </div>
  )
}

export default UserBlock

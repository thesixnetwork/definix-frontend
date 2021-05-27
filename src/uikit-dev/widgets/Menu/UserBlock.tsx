import React from 'react'
import Button from '../../components/Button/Button'
import Dropdown from '../../components/Dropdown/Dropdown'
import Heading from '../../components/Heading/Heading'
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
  const accountEllipsis = account ? `${account.substring(0, 8)}...${account.substring(account.length - 8)}` : null
  // const accountEllipsisLong = account ? `${account.substring(0, 12)}...${account.substring(account.length - 12)}` : null

  return (
    <div>
      {account ? (
        <Dropdown
          isFullWidth
          position="bottom"
          isRainbow
          target={
            <Button
              size="sm"
              fullWidth
              variant="secondary"
              className="connect-btn"
              // onClick={() => {
              //   onPresentAccountModal()
              // }}
            >
              {accountEllipsis}
            </Button>
          }
        >
          <div className="pb-2" style={{ zIndex: 999 }}>
            <Heading fontSize="14px !important" className="mb-3 pa-0 pt-2">
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
        <Button
          size="sm"
          fullWidth
          variant="secondary"
          className="connect-btn"
          onClick={() => {
            onPresentConnectModal()
          }}
        >
          Connect wallet
        </Button>
      )}
    </div>
  )
}

export default UserBlock

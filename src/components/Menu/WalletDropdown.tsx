import React, { useState, useCallback, useEffect } from 'react'
import { Flex, CheckBIcon, ColorStyles, Dropdown, DropdownItem, DropdownProps } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'

interface Props extends Partial<DropdownProps> {
  account: string
  logout: () => void
  target: React.ReactElement
}

let timeout: NodeJS.Timeout

const WalletDropdown: React.FC<Props> = ({ target, account, logout, ...props }) => {
  const { t } = useTranslation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const onItemClick = useCallback(
    (index: number) => {
      if (index === 0) {
        window.open(`https://scope.klaytn.com/account/${account}?tabId=txList`, '_blank')
      } else if (index === 1) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(account)
        }
        setIsCopied(true)
      } else {
        logout()
      }
    },
    [account, logout],
  )

  useEffect(() => {
    if (!isCopied) return

    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => {
      setIsCopied(false)
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
    }, 3000)
  }, [isCopied])

  return (
    <Dropdown
      scale="sm"
      isOpen={isDropdownOpen}
      position="bottom"
      target={React.cloneElement(target, {
        onClick: () => setIsDropdownOpen(!isDropdownOpen),
      })}
      onItemClick={onItemClick}
      {...props}
    >
      <DropdownItem>{t('View on KlaytnscopeTH')}</DropdownItem>
      <DropdownItem>
        <Flex width="100%" alignItems="center" justifyContent="space-between">
          {t('Copy Address')}
          {isCopied && (
            <Flex alignItems="center" color={ColorStyles.MEDIUMGREY}>
              <CheckBIcon />
              {t('Copied')}
            </Flex>
          )}
        </Flex>
      </DropdownItem>
      <DropdownItem>{t('Disconnect')}</DropdownItem>
    </Dropdown>
  )
}

export default WalletDropdown

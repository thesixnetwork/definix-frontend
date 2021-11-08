import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import {
  Text,
  Flex,
  Button,
  IconButton,
  ButtonVariants,
  ButtonScales,
  useWalletModal,
  Login,
  ArrowRightGIcon,
  MoreNIcon,
  GnbMySIcon,
  ColorStyles,
  TextStyles,
  useMatchBreakpoints,
} from 'definixswap-uikit'
import useTranslation from 'contexts/Localisation/useTranslation'
import { useHistory } from 'react-router'
import WalletDropdown from './WalletDropdown'
import NetWorth from './NetWorth'
import { localStorageKey } from '../WalletModal/config'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 188px;
`

const StyledButton = styled.a`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  width: calc(100% + 40px);
  margin: 0 -20px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  background-color: ${({ theme }) => theme.colors[ColorStyles.DEEPBROWN]};
`

const UserBlock: React.FC = () => {
  const history = useHistory()
  const { isMobile } = useMatchBreakpoints()
  const { account, connect, reset } = useWallet()
  const { t } = useTranslation()
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(connect as Login, reset, account)
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null

  const logout = useCallback(() => {
    reset()
    window.localStorage.removeItem('userAccount')
    window.localStorage.removeItem('connector')
    window.localStorage.removeItem(localStorageKey)
    window.location.reload()
  }, [reset])

  if (account) {
    return isMobile ? (
      <Wrapper>
        <Flex pl="12px" flexDirection="column" alignItems="flex-start">
          <Text mt="55px" textStyle={TextStyles.R_12R} color={ColorStyles.MEDIUMGREY}>
            {t('Wallet Address')}
          </Text>
          <Flex>
            <Text mt="2px" mr="4px" textStyle={TextStyles.R_18M} color={ColorStyles.BLACK}>
              {accountEllipsis}
            </Text>
            <WalletDropdown
              width="188px"
              left="-105px"
              target={<IconButton startIcon={<MoreNIcon />} />}
              account={account}
              logout={logout}
            />
          </Flex>
        </Flex>
        <StyledButton
          onClick={() => {
            history.push('/myinvestments')
          }}
        >
          <Text textStyle={TextStyles.R_12M} color={ColorStyles.WHITE}>
            {t('Net Worth')}
          </Text>
          <Flex ml="12px" alignItems="center">
            <Text mr="7px" textStyle={TextStyles.R_12B} width="140px" color={ColorStyles.WHITE}>
              <NetWorth />
            </Text>
            <IconButton startIcon={<ArrowRightGIcon />} />
          </Flex>
        </StyledButton>
      </Wrapper>
    ) : (
      <>
        <Flex>
          <WalletDropdown
            target={
              <Button scale={ButtonScales.S_32} variant={ButtonVariants.LIGHTBROWN} textStyle={TextStyles.R_12B}>
                {accountEllipsis}
              </Button>
            }
            account={account}
            logout={logout}
          />
        </Flex>
        <Button
          ml="8px"
          scale={ButtonScales.S_32ICON}
          minWidth="auto"
          variant={ButtonVariants.DEEPBROWN}
          startIcon={<GnbMySIcon />}
          onClick={() => {
            // onPresentAccountModal();
            history.push('/myinvestments')
          }}
        >
          <Text textStyle={TextStyles.R_12B} ml="6px">
            {t('MY')}
          </Text>
        </Button>
      </>
    )
  }

  return (
    <Flex width="100%" height={isMobile ? '188px' : 'auto'} alignItems="center" justifyContent="center">
      <Button
        scale={isMobile ? ButtonScales.S_40 : ButtonScales.S_32}
        variant={ButtonVariants.RED}
        onClick={() => {
          onPresentConnectModal()
        }}
      >
        {t('Connect Wallet')}
      </Button>
    </Flex>
  )
}

export default UserBlock

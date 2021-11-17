import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { provider } from 'web3-core'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import { Route, useRouteMatch } from 'react-router-dom'
import FlexLayout from 'components/layout/FlexLayout'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import styled from 'styled-components'
import { Text, Box, TitleSet } from 'definixswap-uikit'
import Flip from '../../uikit-dev/components/Flip'
import CardSummary from './components/CardSummary'
import MyFarmsAndPools from './components/MyFarmsAndPools'
import MyInvestmentContext from './MyInvestmentContext'

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
  background: url(${({ theme }) => theme.colors.backgroundPolygon});
  background-size: cover;
  background-repeat: no-repeat;
`

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const MyInvestments: React.FC = () => {
  const { t } = useTranslation()
  const { path } = useRouteMatch()
  const { account }: { account: string; klaytn: provider } = useWallet()

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()

  const [isPhrase2, setIsPhrase2] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [modalNode, setModalNode] = useState<React.ReactNode>()

  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()

  const handlePresent = useCallback((node: React.ReactNode) => {
    setModalNode(node)
    setIsOpenModal(true)
    window.scrollTo(0, 0)
  }, [])

  const handleDismiss = useCallback(() => {
    setModalNode(undefined)
    setIsOpenModal(false)
  }, [])

  useEffect(() => {
    if (currentTime < phrase2TimeStamp) {
      setTimeout(() => {
        setIsPhrase2(true)
      }, phrase2TimeStamp - currentTime)
    } else {
      setIsPhrase2(true)
    }
  }, [currentTime, phrase2TimeStamp])

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  useEffect(() => {
    return () => {
      setIsPhrase2(false)
      setModalNode(undefined)
      setIsOpenModal(false)
    }
  }, [])

  return (
    <MyInvestmentContext.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      <Helmet>
        <title>My investments - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <Box className="">
        <TitleSet title={t('My Investment')} description={t('Check your investment history and profit')} />
        <Route exact path={`${path}`}>
          <CardSummary />
          <MyFarmsAndPools />
        </Route>
      </Box>
      {/* <TwoPanelLayout style={{ display: isOpenModal ? 'none' : 'block' }}>
        <LeftPanel isShowRightPanel={false}>
          <MaxWidth>
            <div className="mb-5">
              <div className="flex align-center mb-2">
                <Heading as="h1" fontSize="32px !important" className="mr-3" textAlign="center">
                  My investments
                </Heading>
              </div>
              <Text>디피닉스에서 예치한 상품들을 모두 확인하세요.</Text>
            </div>

            <TimerWrapper isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)} date={phrase2TimeStamp}>
              <FlexLayout cols={1}>
                <Route exact path={`${path}`}>
                  <CardSummary />
                  <MyFarmsAndPools />
                </Route>
              </FlexLayout>
            </TimerWrapper>
          </MaxWidth>
        </LeftPanel>
      </TwoPanelLayout> */}

      {isOpenModal && React.isValidElement(modalNode) && (
        <ModalWrapper>
          {React.cloneElement(modalNode, {
            onDismiss: handleDismiss,
          })}
        </ModalWrapper>
      )}
    </MyInvestmentContext.Provider>
  )
}

// const TimerWrapper = ({ isPhrase2, date, children }) => {
//   return isPhrase2 ? (
//     children
//   ) : (
//     <>
//       <div>
//         <br />
//         <Flip date={date} />
//         <br />
//         <br />
//         <br />
//       </div>
//       <div
//         tabIndex={0}
//         role="button"
//         style={{ opacity: 0.4, pointerEvents: 'none' }}
//         onClick={(e) => {
//           e.preventDefault()
//         }}
//         onKeyDown={(e) => {
//           e.preventDefault()
//         }}
//       >
//         {children}
//       </div>
//     </>
//   )
// }

export default MyInvestments

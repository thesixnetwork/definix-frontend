/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Lottie from 'react-lottie'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  ArrowBackIcon,
  Button,
  Card,
  ChevronRightIcon,
  Link as UiLink,
  Text,
  useMatchBreakpoints,
  useModal,
} from 'uikit-dev'
import success from 'uikit-dev/animation/complete.json'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import CardHeading from './components/CardHeading'
import CurrencyInputPanel from './components/CurrencyInputPanel'
import ErrorOverLimitModal from './components/ErrorOverLimitModal'
import PriceUpdate from './components/PriceUpdate'
import Share from './components/Share'
import SpaceBetweenFormat from './components/SpaceBetweenFormat'
import TwoLineFormat from './components/TwoLineFormat'
import VerticalAssetRatio from './components/VerticalAssetRatio'
import currency from './mockCurrency'

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const MaxWidth = styled.div`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`

const LeftPanelAbsolute = styled(LeftPanel)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 24px;
`

const CardInput = ({ onNext }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Card className="mb-4">
      <div className={isMobile ? 'pa-4 pt-2' : 'pa-6 pt-4'}>
        <Button
          variant="text"
          as={Link}
          to="/explore/detail"
          ml="-12px"
          mb="8px"
          padding="0 12px"
          startIcon={<ArrowBackIcon />}
        >
          <Text fontSize="14px" color="textSubtle">
            Back
          </Text>
        </Button>

        <TwoLineFormat title="Share price" value="$1,928.03" percent="+0.2%" large className="mb-4" />

        <div className="flex">
          <Text className="mb-2">Invest</Text>
        </div>

        <div className="mb-4">
          {currency.map((c) => (
            <CurrencyInputPanel
              currency={c}
              id={`invest-${c.name}`}
              key={`invest-${c.name}`}
              showMaxButton
              className="mb-2"
              value=""
              label=""
              onUserInput={(value) => {
                console.log(value)
              }}
            />
          ))}
        </div>

        <SpaceBetweenFormat className="mb-4" title="Total value" value="$00" />

        <Button fullWidth radii="small" onClick={onNext}>
          Calculate invest amount
        </Button>
      </div>
    </Card>
  )
}

const CardCalculate = ({ onBack, onNext }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Card className="mb-4">
      <div className={`bd-b ${isMobile ? 'pa-4 pt-2' : 'px-6 py-4'} `}>
        <Button variant="text" ml="-12px" mb="8px" padding="0 12px" startIcon={<ArrowBackIcon />} onClick={onBack}>
          <Text fontSize="14px" color="textSubtle">
            Back
          </Text>
        </Button>

        <CardHeading />
      </div>

      <div className={`bd-b ${isMobile ? 'pa-4' : 'px-6 py-4'} `}>
        <Text fontSize="24px" bold lineHeight="1.3" className="mb-3">
          Invest
        </Text>

        <div className="flex align-center flex-wrap mb-3">
          <VerticalAssetRatio className={isMobile ? 'col-12' : 'col-5'} />
          <div className={`flex flex-column ${isMobile ? 'col-12 pt-4 align-center' : 'col-7 pl-4 align-end'}`}>
            <Share share="100" usd="~192,803.00" textAlign={isMobile ? 'center' : 'left'} />
            <PriceUpdate className="mt-3" />
          </div>
        </div>

        <Text fontSize="12px" textAlign={isMobile ? 'center' : 'left'}>
          Output is estimated. You will receive at least <strong>192,803.00 USD</strong> or the transaction will revert.
        </Text>
      </div>

      <div className={isMobile ? 'pa-4' : 'pa-6 pt-4'}>
        <SpaceBetweenFormat className="mb-2" title="Minimum Received" value="100 SHARE" />
        <SpaceBetweenFormat
          className="mb-2"
          title="Price Impact"
          value="< 0.1%"
          valueColor="success" /* || failure */
        />
        <SpaceBetweenFormat className="mb-2" title="Liquidity Provider Fee" value="0.003996 SIX" />

        <Button fullWidth radii="small" className="mt-2" onClick={onNext}>
          Invest
        </Button>
      </div>
    </Card>
  )
}

const CardResponse = () => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Card className="mb-4">
      <div className={isMobile ? 'pa-4' : 'pa-6'}>
        <div className="flex flex-column align-center justify-center mb-6">
          <Lottie options={SuccessOptions} height={120} width={120} />
          {/* <ErrorIcon width="80px" color="failure" className="mb-3" /> */}
          <Text fontSize="24px" bold textAlign="center">
            Invest Complete
          </Text>
          <Text color="textSubtle" textAlign="center" className="mt-1" fontSize="12px">
            27 June 2021, 15:32
          </Text>

          <CardHeading className="mt-6" />
        </div>

        <div className="flex align-center flex-wrap mb-6">
          <VerticalAssetRatio className={isMobile ? 'col-12' : 'col-5'} />
          <div className={`flex flex-column ${isMobile ? 'col-12 pt-4 align-center' : 'col-7 pl-4 align-end'}`}>
            <Share share="100" usd="~192,803.00" textAlign={isMobile ? 'center' : 'left'} />
          </div>
        </div>

        <SpaceBetweenFormat
          titleElm={
            <div className="flex">
              <Text fontSize="12px" color="textSubtle" className="mr-2">
                Transaction Hash
              </Text>
              <Text fontSize="12px" color="primary" bold>
                0x91….24xd
              </Text>
            </div>
          }
          valueElm={
            <UiLink
              href="https://scope.klaytn.com/account/}"
              fontSize="12px"
              color="textSubtle"
              style={{ marginRight: '-4px' }}
            >
              KlaytnScope
              <ChevronRightIcon color="textSubtle" />
            </UiLink>
          }
          className="mb-2"
        />

        <Button as={Link} to="/explore/detail" fullWidth radii="small" className="mt-3">
          Back to Explore
        </Button>
      </div>
    </Card>
  )
}

const Invest: React.FC = () => {
  const [isInputting, setIsInputting] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isInvested, setIsInvested] = useState(false)

  const [onPresentErrorOverLimitModal] = useModal(<ErrorOverLimitModal />)

  useEffect(() => {
    return () => {
      setIsInputting(true)
      setIsCalculating(false)
      setIsInvested(false)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <TwoPanelLayout>
        <LeftPanelAbsolute isShowRightPanel={false}>
          <MaxWidth>
            {isInputting && (
              <CardInput
                onNext={() => {
                  setIsInputting(false)
                  setIsCalculating(true)
                }}
              />
            )}{' '}
            {isCalculating && (
              <CardCalculate
                onBack={() => {
                  setIsCalculating(false)
                  setIsInputting(true)
                }}
                onNext={() => {
                  setIsCalculating(false)
                  setIsInvested(true)
                }}
              />
            )}
            {isInvested && <CardResponse />}
          </MaxWidth>
        </LeftPanelAbsolute>
      </TwoPanelLayout>
    </>
  )
}

export default Invest

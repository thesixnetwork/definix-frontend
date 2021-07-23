/* eslint-disable no-nested-ternary */
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Lottie from 'react-lottie'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowBackIcon, Button, Card, ChevronRightIcon, Link as UiLink, Text, useMatchBreakpoints } from 'uikit-dev'
import success from 'uikit-dev/animation/complete.json'
import Helper from 'uikit-dev/components/Helper'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import CardHeading from './components/CardHeading'
import CurrencyInputPanel from './components/CurrencyInputPanel'
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

const Coin = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 16px 4px 0;

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const FormControlLabelCustom = styled(FormControlLabel)`
  height: 40px;
  margin: 0 0 0 -10px !important;

  .MuiFormControlLabel-label {
    flex-grow: 1;
  }
`

const InlineAssetRatioLabel = ({ coin, className = '' }) => (
  <div className={`flex justify-space-between align-center ${className}`}>
    <Coin className="col-8">
      <img src={coin.img} alt="" />
      <Text className="col-3 mr-4" bold>
        {coin.value}
      </Text>
      <Text>{coin.name}</Text>
    </Coin>

    <Text fontSize="12px" color="textSubtle" className="col-4" textAlign="right" style={{ letterSpacing: '0' }}>
      Ratio : {coin.percent}
    </Text>
  </div>
)

const CardInput = ({ onNext, ratioType, setRatioType }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Card className="mb-4">
      <div className={`bd-b ${isMobile ? 'pa-4 pt-2' : 'px-6 py-4'} `}>
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

        <TwoLineFormat title="Current investment" value="1.24 Shares" subTitle="$1,000.23" large className="mb-4" />

        <div className="flex flex-wrap justify-space-between align-center">
          <Text>Withdraw</Text>

          <RadioGroup
            className="flex flex-row flex-wrap"
            name="tokenType"
            value={ratioType}
            onChange={(e) => {
              setRatioType(e.target.value)
            }}
          >
            <FormControlLabel
              value="all"
              control={<Radio color="primary" size="small" />}
              label={<Text>All token</Text>}
            />
            <FormControlLabel
              className="mr-0"
              value="multi"
              control={<Radio color="primary" size="small" />}
              label={<Text>Multiple token</Text>}
            />
          </RadioGroup>
        </div>

        <CurrencyInputPanel
          currency={{ name: 'Shares' }}
          id="withdraw-fund"
          showMaxButton
          hideBalance
          value=""
          label=""
          onUserInput={(value) => {
            console.log(value)
          }}
        />
        <Text fontSize="12px" color="textSubtle" className="mt-1" textAlign="right">
          ~ $0000
        </Text>
      </div>

      <div className={`bd-b ${isMobile ? 'pa-4' : 'px-6 py-4'} `}>
        {ratioType === 'all' ? (
          currency.map((c) => <InlineAssetRatioLabel coin={c} className="py-1" />)
        ) : (
          <FormGroup>
            {currency.map((c) => (
              <FormControlLabelCustom
                control={<Checkbox size="small" color="primary" />}
                label={<InlineAssetRatioLabel coin={c} />}
              />
            ))}
          </FormGroup>
        )}
      </div>

      <div className={`bd-b ${isMobile ? 'pa-4' : 'px-6 py-4'} `}>
        <SpaceBetweenFormat
          className="mb-2"
          title="Price Impact"
          value="< 0.1%"
          valueColor="success" /* || failure */
        />
        <SpaceBetweenFormat className="mb-2" title="Management fee 0.2%" value="$00 " hint="xx" />
        <SpaceBetweenFormat className="mb-2" title="FINIX buy back fee 0.3%" value="$00 " hint="xx" />
        <SpaceBetweenFormat title="Ecosystem fee 0.3%" value="$00 " hint="xx" />
      </div>

      <div className={isMobile ? 'pa-4' : 'pa-6 pt-4'}>
        <SpaceBetweenFormat
          className="mb-2"
          titleElm={
            <div className="flex pr-3">
              <Text fontSize="12px" color="textSubtle">
                Early withdrawal fee
              </Text>
              <Helper text="" className="mx-2" position="top" />
              <Text fontSize="12px" color="textSubtle">
                00:00
              </Text>
            </div>
          }
          title="Early withdrawal fee 0.5%"
          value="$00 "
          hint="xx"
        />
        <Button fullWidth radii="small" onClick={onNext} className="mt-2">
          Withdraw
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
            Withdraw Complete
          </Text>
          <Text color="textSubtle" textAlign="center" className="mt-1" fontSize="12px">
            27 June 2021, 15:32
          </Text>

          <CardHeading className="mt-6" />
        </div>

        <div className="flex flex-wrap align-center mb-6">
          <div className={`flex flex-column ${isMobile ? 'col-12 pb-4 align-center' : 'col-7 pl-4 align-end'}`}>
            <Share share="100" usd="~192,803.00" textAlign={isMobile ? 'center' : 'left'} />
          </div>
          <VerticalAssetRatio className={isMobile ? 'col-12' : 'col-5'} />
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
  const [isWithdrawn, setIsWithdrawn] = useState(false)
  const [ratioType, setRatioType] = useState('all')

  useEffect(() => {
    return () => {
      setIsInputting(true)
      setIsWithdrawn(false)
      setRatioType('all')
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
                ratioType={ratioType}
                setRatioType={setRatioType}
                onNext={() => {
                  setIsInputting(false)
                  setIsWithdrawn(true)
                }}
              />
            )}{' '}
            {isWithdrawn && <CardResponse />}
          </MaxWidth>
        </LeftPanelAbsolute>
      </TwoPanelLayout>
    </>
  )
}

export default Invest

/* eslint-disable react/jsx-pascal-case */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Card, ChevronLeftIcon, ChevronRightIcon, Heading, Text } from 'uikit-dev'
import getStarted from 'uikit-dev/images/for-ui-v2/get-started.png'
import m01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-01.png'
import m02 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-02.png'
import m03 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-03.png'
import m04 from 'uikit-dev/images/for-ui-v2/tutorial-elements/BSC/Definix-Tutorial-Elements-04.png'
import BSC_1_1 from './BSC/BSC_1_1'
import BSC_1_2 from './BSC/BSC_1_2'
import BSC_1_3 from './BSC/BSC_1_3'
import BSC_1_4 from './BSC/BSC_1_4'
import BSC_1_5 from './BSC/BSC_1_5'
import BSC_2_1 from './BSC/BSC_2_1'
import BSC_2_2 from './BSC/BSC_2_2'
import BSC_2_3 from './BSC/BSC_2_3'
import BSC_2_4 from './BSC/BSC_2_4'
import BSC_2_5 from './BSC/BSC_2_5'
import BSC_2_6 from './BSC/BSC_2_6'
import BSC_2_7 from './BSC/BSC_2_7'
import BSC_3_1 from './BSC/BSC_3_1'
import BSC_3_2 from './BSC/BSC_3_2'
import BSC_3_3 from './BSC/BSC_3_3'
import BSC_3_4 from './BSC/BSC_3_4'
import BSC_4_1 from './BSC/BSC_4_1'
import BSC_4_2 from './BSC/BSC_4_2'
import BSC_4_3 from './BSC/BSC_4_3'
import BSC_4_4 from './BSC/BSC_4_4'
import BSC_4_5 from './BSC/BSC_4_5'
import Klaytn_1_1 from './Klaytn/Klaytn_1_1'
import Klaytn_1_2 from './Klaytn/Klaytn_1_2'
import Klaytn_1_3 from './Klaytn/Klaytn_1_3'
import Klaytn_2_1 from './Klaytn/Klaytn_2_1'
import Klaytn_2_2 from './Klaytn/Klaytn_2_2'
import Klaytn_2_3_bsc from './Klaytn/Klaytn_2_3_bsc'
import Klaytn_2_3_klaytn from './Klaytn/Klaytn_2_3_klaytn'
import Klaytn_2_4_bsc from './Klaytn/Klaytn_2_4_bsc'
import Klaytn_2_4_klaytn from './Klaytn/Klaytn_2_4_klaytn'
import Klaytn_2_5_bsc from './Klaytn/Klaytn_2_5_bsc'
import Klaytn_2_6_bsc from './Klaytn/Klaytn_2_6_bsc'
import Klaytn_2_7 from './Klaytn/Klaytn_2_7'
import Klaytn_2_8 from './Klaytn/Klaytn_2_8'
import Klaytn_2_9 from './Klaytn/Klaytn_2_9'
import Klaytn_3_1 from './Klaytn/Klaytn_3_1'
import Klaytn_3_2 from './Klaytn/Klaytn_3_2'
import Klaytn_3_3 from './Klaytn/Klaytn_3_3'
import Klaytn_3_4 from './Klaytn/Klaytn_3_4'
import Klaytn_4_1 from './Klaytn/Klaytn_4_1'
import Klaytn_4_2 from './Klaytn/Klaytn_4_2'
import Klaytn_4_3 from './Klaytn/Klaytn_4_3'
import Klaytn_4_4 from './Klaytn/Klaytn_4_4'
import Klaytn_4_5 from './Klaytn/Klaytn_4_5'
import MainStep from './MainStep'

const StyledBanner = styled(Card)<{ isStarted: boolean }>`
  width: 100%;
  padding: 64px 0 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 820px;
  flex-grow: 1;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    background: ${({ isStarted }) => (!isStarted ? `url(${getStarted})` : 'none')};
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    position: absolute;
    bottom: 0;
    right: 24px;
    pointer-events: none;
  }

  h2 {
    font-size: 24px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 32px !important;
    }
  }
`

const TopNavigationStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BottomNavigationStyle = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const Overflow = styled.div`
  flex-grow: 1;
  overflow: auto;
  padding: 0 40px 40px 40px;
`

const Page = styled(Text)`
  position: absolute;
  line-height: 24px;
  height: 24px;
  top: calc(50% - 12px);
  left: 50%;
  transform: translate(-50%, 0);
`

const CustomButton = styled(Button)`
  box-shadow: ${({ theme }) => theme.shadows.elevation};
`

const CardGetStarted = ({ isBsc = false, className = '' }) => {
  const [isStarted, setIsStarted] = useState(false)
  const [curMainStep, setCurMainStep] = useState(null)
  const [curSubStep, setCurSubStep] = useState(null)
  const [isTransferSixFromKlaytn, setIsTransferSixFromKlaytn] = useState(false) // For Klaytn > Main2 > Sub2 > Select 'From Klaytn'

  useEffect(() => {
    return () => {
      setIsStarted(false)
      setCurMainStep(null)
      setCurSubStep(null)
      setIsTransferSixFromKlaytn(false)
    }
  }, [])

  const bsc = [
    {
      title: 'Preparation & Wallet setup',
      img: m01,
      steps: [BSC_1_1, BSC_1_2, BSC_1_3, BSC_1_4, BSC_1_5],
      stepsKlaytn: undefined,
    },
    {
      title: 'Transfer token to your wallet',
      img: m02,
      steps: [BSC_2_1, BSC_2_2, BSC_2_3, BSC_2_4, BSC_2_5, BSC_2_6, BSC_2_7],
      stepsKlaytn: undefined,
    },
    {
      title: 'Connect wallet & Swap tokens',
      img: m03,
      steps: [BSC_3_1, BSC_3_2, BSC_3_3, BSC_3_4],
      stepsKlaytn: undefined,
    },
    {
      title: 'Liquidity pairing & Farming',
      img: m04,
      steps: [BSC_4_1, BSC_4_2, BSC_4_3, BSC_4_4, BSC_4_5],
      stepsKlaytn: undefined,
    },
  ]

  const klaytn = [
    {
      title: 'Preparation & Wallet setup',
      img: m01,
      steps: [Klaytn_1_1, Klaytn_1_2, Klaytn_1_3],
      stepsKlaytn: undefined,
    },
    {
      title: 'Transfer token to your wallet',
      img: m02,
      steps: [
        Klaytn_2_1,
        Klaytn_2_2,
        Klaytn_2_3_bsc,
        Klaytn_2_4_bsc,
        Klaytn_2_5_bsc,
        Klaytn_2_6_bsc,
        Klaytn_2_7,
        Klaytn_2_8,
        Klaytn_2_9,
      ],
      stepsKlaytn: [Klaytn_2_1, Klaytn_2_2, Klaytn_2_3_klaytn, Klaytn_2_4_klaytn, Klaytn_2_7, Klaytn_2_8, Klaytn_2_9],
    },
    {
      title: 'Connect wallet & Swap tokens',
      img: m03,
      steps: [Klaytn_3_1, Klaytn_3_2, Klaytn_3_3, Klaytn_3_4],
      stepsKlaytn: undefined,
    },
    {
      title: 'Liquidity pairing & Farming',
      img: m04,
      steps: [Klaytn_4_1, Klaytn_4_2, Klaytn_4_3, Klaytn_4_4, Klaytn_4_5],
      stepsKlaytn: undefined,
    },
  ]

  const mainSteps = isBsc ? bsc : klaytn

  const onBack = (isBackToFirstPage = false) => {
    if (curMainStep === null) {
      setIsStarted(false)
      setCurMainStep(null)
      setCurSubStep(null)
      setIsTransferSixFromKlaytn(false)
    } else if (curSubStep < 1 || isBackToFirstPage) {
      setCurMainStep(null)
      setCurSubStep(null)
      setIsTransferSixFromKlaytn(false)
    } else {
      setCurSubStep(curSubStep - 1)
    }
  }

  const onNext = (main = undefined, sub = undefined) => {
    if (main !== undefined && sub !== undefined) {
      setCurMainStep(main)
      setCurSubStep(sub)
    } else {
      setCurSubStep(curSubStep + 1)
    }
  }

  const subStepsLength = () => {
    const mainStep = mainSteps[curMainStep]
    return isTransferSixFromKlaytn ? mainStep.stepsKlaytn.length - 1 : mainStep.steps.length - 1
  }

  const SubStep = (props) => {
    const mainStep = mainSteps[curMainStep]
    const Handler = isTransferSixFromKlaytn ? mainStep.stepsKlaytn[curSubStep] : mainStep.steps[curSubStep]
    return <Handler {...props} />
  }

  const BeforeStart = () => (
    <Overflow>
      <Heading className="mb-2" color="primary">
        Let’s start from here :)
      </Heading>
      <Text color="textSubtle">You don’t have any investment yet. Don’t worry, I’ll guide you through the process</Text>

      <Button
        size="md"
        fullWidth
        variant="primary"
        className="btn-secondary-disable mt-5"
        onClick={() => {
          setIsStarted(true)
        }}
        radii="card"
      >
        Get Started
      </Button>
    </Overflow>
  )

  const TopNavigation = () => (
    <TopNavigationStyle>
      <CustomButton
        padding="0 16px 0 8px"
        variant="tertiary"
        onClick={() => {
          onBack(false)
        }}
        startIcon={<ChevronLeftIcon color="primary" className="mr-1" />}
        size="sm"
      >
        <Text fontSize="14px" bold>
          BACK
        </Text>
      </CustomButton>
      {curMainStep !== null && (
        <>
          <Page fontSize="14px" bold>
            {`${curMainStep + 1} / ${curSubStep + 1}`}
          </Page>

          {curSubStep < subStepsLength() && <NextButton />}
        </>
      )}
    </TopNavigationStyle>
  )

  const BottomNavigation = () => (
    <BottomNavigationStyle>
      {/* Show in (Not) Last Sub Step */}
      {curSubStep < subStepsLength() && <NextButton />}

      {/* Show in Last Main Step */}
      {curMainStep === mainSteps.length - 1 && curSubStep === subStepsLength() && (
        <CustomButton
          padding="0 16px 0 8px"
          variant="tertiary"
          onClick={() => {
            onBack(true)
          }}
          size="sm"
          startIcon={<ChevronLeftIcon color="primary" className="mr-1" />}
        >
          <Text fontSize="14px" bold>
            BACK TO FIRST PAGE
          </Text>
        </CustomButton>
      )}
    </BottomNavigationStyle>
  )

  const NextButton = () => (
    <CustomButton
      padding="0 8px 0 16px"
      variant="tertiary"
      onClick={onNext}
      size="sm"
      endIcon={<ChevronRightIcon color="primary" className="ml-1" />}
    >
      <Text fontSize="14px" bold>
        NEXT
      </Text>
    </CustomButton>
  )

  const NextMainStepButton = () => (
    <div className="flex justify-center flex-column align-center mt-6">
      <MainStep
        src={mainSteps[curMainStep + 1].img}
        onClick={() => {
          onNext(curMainStep + 1, 0)
          setIsTransferSixFromKlaytn(false)
        }}
      />
      <CustomButton
        padding="0 8px 0 16px"
        variant="tertiary"
        onClick={() => {
          onNext(curMainStep + 1, 0)
          setIsTransferSixFromKlaytn(false)
        }}
        size="sm"
        endIcon={<ChevronRightIcon color="primary" className="ml-1" />}
      >
        <Text fontSize="14px" bold>
          PROCEED TO NEXT STEP
        </Text>
      </CustomButton>
    </div>
  )

  return (
    <StyledBanner className={className} isStarted={isStarted}>
      {!isStarted ? (
        <BeforeStart />
      ) : (
        <>
          <TopNavigation />

          {curMainStep === null ? (
            <Overflow>
              <Heading className="mb-2" color="primary">
                Start farming in 4 major steps
              </Heading>

              <div className="mt-5">
                {mainSteps.map((m, idx) => (
                  <MainStep
                    key={m.title}
                    src={m.img}
                    onClick={() => {
                      setCurMainStep(idx)
                      setCurSubStep(0)
                    }}
                  />
                ))}
              </div>
            </Overflow>
          ) : (
            <>
              <Overflow>
                <SubStep
                  title={mainSteps[curMainStep].title}
                  onNext={onNext}
                  setIsTransferSixFromKlaytn={setIsTransferSixFromKlaytn}
                />

                {/* Show in Last Sub Step */}
                {curSubStep === subStepsLength() && curMainStep < mainSteps.length - 1 && <NextMainStepButton />}
              </Overflow>

              <BottomNavigation />
            </>
          )}
        </>
      )}
    </StyledBanner>
  )
}

export default CardGetStarted

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
import MainStep from './MainStep'

const StyledBanner = styled(Card)<{ isStarted: boolean }>`
  width: 100%;
  padding: 64px 0 0 0;
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

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

  .bottom-next-btn {
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`

const ButtonGroupStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 8px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Overflow = styled.div`
  flex-grow: 1;
  overflow: auto;
  padding: 0 40px;
`

const Page = styled(Text)`
  position: absolute;
  line-height: 24px;
  height: 24px;
  top: calc(50% - 12px);
  left: 50%;
  transform: translate(-50%, 0);
`

const CardGetStarted = ({ network = 'bsc', className = '' }) => {
  const [isStarted, setIsStarted] = useState(true)
  const [curMainStep, setCurMainStep] = useState(null)
  const [curSubStep, setCurSubStep] = useState(null)

  const bsc = [
    {
      title: 'Preparation & Wallet setup',
      img: m01,
      steps: [BSC_1_1, BSC_1_2, BSC_1_3, BSC_1_4, BSC_1_5],
    },
    {
      title: 'Transfer token to your wallet',
      img: m02,
      steps: [BSC_2_1, BSC_2_2, BSC_2_3, BSC_2_4, BSC_2_5, BSC_2_6, BSC_2_7],
    },
    {
      title: 'Connect wallet & Swap tokens',
      img: m03,
      steps: [BSC_3_1, BSC_3_2, BSC_3_3, BSC_3_4],
    },
    {
      title: 'Liquidity pairing and start farming',
      img: m04,
      steps: [BSC_4_1, BSC_4_2, BSC_4_3, BSC_4_4, BSC_4_5],
    },
  ]

  const klaytn = [
    {
      title: 'Preparation & Wallet setup',
      img: m01,
      steps: [BSC_1_1, BSC_1_2, BSC_1_3, BSC_1_4],
    },
    {
      title: 'Transfer coin from exchange to wallet',
      img: m02,
    },
    {
      title: 'Connect wallet and swap tokens',
      img: m03,
    },
    {
      title: 'Liquidity pairing and start farming',
      img: m04,
    },
  ]

  const mainSteps = network === 'bsc' ? bsc : klaytn

  const onBack = () => {
    if (curMainStep === null) {
      setIsStarted(false)
      setCurMainStep(null)
      setCurSubStep(null)
    } else if (curSubStep < 1) {
      setCurMainStep(null)
      setCurSubStep(null)
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

  const ButtonGroup = () => (
    <ButtonGroupStyle>
      <Button
        variant="text"
        onClick={onBack}
        padding="0 12px"
        startIcon={<ChevronLeftIcon color="primary" />}
        radii="card"
      >
        <Text fontSize="14px" bold>
          BACK
        </Text>
      </Button>
      {curMainStep !== null && (
        <>
          <Page fontSize="14px" bold>
            {`${curMainStep + 1} / ${curSubStep + 1}`}
          </Page>

          {curSubStep < mainSteps[curMainStep].steps.length - 1 && <NextButton />}
        </>
      )}
    </ButtonGroupStyle>
  )

  const NextButton = () => (
    <Button
      variant="text"
      onClick={onNext}
      padding="0 12px"
      endIcon={<ChevronRightIcon color="primary" />}
      radii="card"
    >
      <Text fontSize="14px" bold>
        NEXT
      </Text>
    </Button>
  )

  const NextMainButton = () => (
    <div className="flex justify-center flex-column align-center">
      <MainStep
        src={mainSteps[curMainStep + 1].img}
        onClick={() => {
          onNext(curMainStep + 1, 0)
        }}
      />
      <Button
        variant="text"
        onClick={() => {
          onNext(curMainStep + 1, 0)
        }}
        padding="0 12px"
        endIcon={<ChevronRightIcon color="primary" />}
        radii="card"
      >
        <Text fontSize="14px" bold>
          PROCEED TO NEXT STEP
        </Text>
      </Button>
    </div>
  )

  const SubStep = (props) => {
    const Handler = mainSteps[curMainStep].steps[curSubStep]
    return <Handler {...props} />
  }

  useEffect(() => {
    return () => {
      setIsStarted(false)
      setCurMainStep(null)
      setCurSubStep(null)
    }
  }, [])

  return (
    <StyledBanner className={className} isStarted={isStarted}>
      {!isStarted ? (
        <BeforeStart />
      ) : (
        <>
          <ButtonGroup />

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
                <SubStep title={mainSteps[curMainStep].title} onNext={onNext} />
                {curSubStep === mainSteps[curMainStep].steps.length - 1 && curMainStep < mainSteps.length - 1 && (
                  <NextMainButton />
                )}
              </Overflow>
              {curSubStep < mainSteps[curMainStep].steps.length - 1 && (
                <div className="bottom-next-btn">
                  <NextButton />
                </div>
              )}
            </>
          )}
        </>
      )}
    </StyledBanner>
  )
}

export default CardGetStarted

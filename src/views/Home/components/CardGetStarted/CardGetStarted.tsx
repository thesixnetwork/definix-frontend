import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Card, ChevronLeftIcon, ChevronRightIcon, Heading, Text } from 'uikit-dev'
import getStarted from 'uikit-dev/images/for-ui-v2/get-started.png'
import m01 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Definix-Tutorial-Elements-01.png'
import m02 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Definix-Tutorial-Elements-02.png'
import m03 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Definix-Tutorial-Elements-03.png'
import m04 from 'uikit-dev/images/for-ui-v2/tutorial-elements/Definix-Tutorial-Elements-04.png'
import Step11 from './BSC/Step_1_1'
import Step12 from './BSC/Step_1_2'

const StyledBanner = styled(Card)<{ isStarted: boolean }>`
  width: 100%;
  padding: 64px 40px;
  position: relative;
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

  a,
  button {
    border-radius: ${({ theme }) => theme.radii.default};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 32px !important;
    }
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

const Major = styled.img`
  cursor: pointer;
`

const Page = styled(Text)`
  position: absolute;
  line-height: 24px;
  height: 24px;
  top: calc(50% - 12px);
  left: 50%;
  transform: translate(-50%, 0);
`

const CardGetStarted = ({ className = '' }) => {
  const [isStarted, setIsStarted] = useState(true)
  const [currStep, setCurrStep] = useState([0, 0])

  const tutorials = [
    {
      title: 'Preparation & Wallet setup',
      img: m01,
      subSteps: [Step11, Step12],
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

  const onBack = () => {
    if (currStep[0] === 0) {
      setIsStarted(false)
      setCurrStep([0, 0])
    } else if (currStep[0] > 0) {
      if (currStep[1] < 2) {
        setCurrStep([0, 0])
      } else {
        setCurrStep([currStep[0], currStep[1] - 1])
      }
    }
  }

  const onNext = () => {
    setCurrStep([currStep[0], currStep[1] + 1])
  }

  const onNextMajor = () => {
    setCurrStep([currStep[0] + 1, 0])
  }

  useEffect(() => {
    return () => {
      setIsStarted(false)
      setCurrStep([0, 0])
    }
  }, [])

  const BeforeStart = () => (
    <>
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
      >
        Get Started
      </Button>
    </>
  )

  const ButtonGroup = () => (
    <ButtonGroupStyle>
      <Button variant="text" onClick={onBack} padding="0 12px" startIcon={<ChevronLeftIcon color="primary" />}>
        <Text fontSize="14px" bold>
          BACK
        </Text>
      </Button>
      {currStep[0] > 0 && (
        <>
          <Page fontSize="14px" bold>
            {`${currStep[0]} / ${currStep[1]}`}
          </Page>

          <NextButton />
        </>
      )}
    </ButtonGroupStyle>
  )

  const NextButton = () => (
    <Button variant="text" onClick={onNext} padding="0 12px" endIcon={<ChevronRightIcon color="primary" />}>
      <Text fontSize="14px" bold>
        NEXT
      </Text>
    </Button>
  )

  const NextMajorButton = () => (
    <Button variant="text" onClick={onNextMajor} padding="0 12px" endIcon={<ChevronRightIcon color="primary" />}>
      <Text fontSize="14px" bold>
        PROCEED TO NEXT STEP
      </Text>
    </Button>
  )

  return (
    <StyledBanner className={className} isStarted={isStarted}>
      {isStarted ? (
        <>
          <ButtonGroup />

          {currStep[0] > 0 ? (
            <Step12 title={tutorials[currStep[0] - 1].title} />
          ) : (
            <>
              <Heading className="mb-2" color="primary">
                Start farming in 4 major steps
              </Heading>

              <div className="mt-5" style={{ marginLeft: '-12px', marginRight: '-12px' }}>
                {tutorials.map((m, idx) => (
                  <Major
                    key={m.title}
                    src={m.img}
                    alt=""
                    onClick={() => {
                      setCurrStep([idx + 1, 1])
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <BeforeStart />
      )}
    </StyledBanner>
  )
}

export default CardGetStarted

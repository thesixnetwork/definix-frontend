import React from 'react'
import styled from 'styled-components'
import { Button, Card, Heading, Text } from 'uikit-dev'
import getStarted from 'uikit-dev/images/for-ui-v2/get-started.png'

const StyledBanner = styled(Card)`
  width: 100%;
  padding: 64px 40px;
  position: relative;
  flex-grow: 1;

  &:before {
    content: '';
    width: 80%;
    height: 100%;
    background: url(${getStarted});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    position: absolute;
    bottom: 0;
    left: 10%;
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

const CardGetStarted = ({ className = '' }) => {
  return (
    <StyledBanner className={className}>
      <Heading className="mb-2" color="primary">
        Let’s start from here :)
      </Heading>
      <Text color="textSubtle">You don’t have any investment yet. Don’t worry, I’ll guide you through the process</Text>

      <Button as="a" href="#" size="md" fullWidth variant="primary" className="btn-secondary-disable mt-5">
        Get Started
      </Button>
    </StyledBanner>
  )
}

export default CardGetStarted

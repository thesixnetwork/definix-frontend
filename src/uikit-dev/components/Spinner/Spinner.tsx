import React from 'react'
import styled, { keyframes } from 'styled-components'
import logo64 from '../../images/64x64.png'
import { SpinnerProps } from './types'

const float = keyframes`
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
`

const Container = styled.div`
  position: relative;
`

const FloatingLogo = styled.img`
  animation: ${float} 1s ease-in-out infinite;
`

const Spinner: React.FC<SpinnerProps> = () => {
  return (
    <Container>
      <FloatingLogo src={logo64} alt="" />
    </Container>
  )
}

export default Spinner

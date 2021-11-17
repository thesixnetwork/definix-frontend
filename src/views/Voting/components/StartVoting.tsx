/* eslint-disable no-nested-ternary */
import React from 'react'
import { Text } from 'uikit-dev'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import development from '../../../uikit-dev/images/for-ui-v2/voting/voting-development.png'

const Background = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 40px 24px;
  background: url(${({ theme }) => theme.colors.backgroundPolygon});
  background-size: cover;
  background-repeat: no-repeat;
  transition: 0.1s;
`

const Banner = styled.div`
  margin-top: 160px;
  justify-items: center;
  display: grid;
  text-align: center;
`


const StartVoting = () => {
  const { isDark } = useTheme()
  return (
    <>
      <Background>
        <Banner>
          <img src={development} alt="dev-voting" width="30%" />
          <div className="mt-5">
            <Text fontSize="20px" bold color={isDark ? '#fff' : '#737375'}>Decentralized Voting</Text>
            <Text fontSize="14px" color={isDark ? '#fff' : '#737375'}>is under development.</Text>
          </div>
        </Banner>
      </Background>
    </>
  )
}

export default StartVoting

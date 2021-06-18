/* eslint eqeqeq: 0 */

import React, { ReactElement, useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Button, Card, Heading, Text, Link, Input, Modal } from 'uikit-dev'
import { provider } from 'web3-core'
import UnlockButton from 'components/UnlockButton'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import klaytnLogo from 'uikit-dev/images/Logo-Klaytn.png'
import { tr } from 'date-fns/locale'
import DiscriptionSecondAirdrop from './DiscriptionSecondAirdrop'

const MaxWidth = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
`

const StyledBanner = styled(Card)`
  padding: 24px;
  width: 100%;
  // background:
  background-size: 150%;
  background-repeat: no-repeat;
  background-position: center 40%;
  background-color: ${({ theme }) => theme.colors.card};

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
    margin-bottom: 4px;
  }
  img {
    width: 120px;
  }

  a {
    margin-top: 1rem;
  }

  > div > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    &:nth-of-type(01) {
      flex-grow: 1;
    }
    &:nth-of-type(02) {
      flex-shrink: 0;
      margin-bottom: 0.5rem;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 40px !important;
    }
    h3 {
      font-size: 20px !important;
    }
    a {
      min-width: 200px;
    }

    img {
      width: 180px;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > div {
      flex-direction: row;
      align-items: center;

      > div {
        &:nth-of-type(01) {
          padding: 24px 24px 24px 0;
          align-items: flex-start;
          text-align: left;
        }
        &:nth-of-type(02) {
          margin: 0;
        }
      }
    }
  }
`


export default function CardContentAirdrop(): ReactElement {  
  
  return (
    <StyledBanner>
      <MaxWidth>
        <div>
          

          <div style={{ marginTop: '40px' }}>
            <DiscriptionSecondAirdrop open disable />
            <br />
            <br />
           
          </div>
        </div>
      </MaxWidth>
    </StyledBanner>
  )
}

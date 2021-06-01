import React from 'react'
import styled from 'styled-components'
import { Card, Text } from 'uikit-dev'
import certik from 'uikit-dev/images/Audit/AW-42.png'
import techRate from 'uikit-dev/images/Audit/AW-43.png'
import audit from 'uikit-dev/images/for-ui-v2/audit.png'

const Audit = styled(Card)`
  padding: 24px 40% 24px 24px;
  position: relative;

  &:before {
    content: '';
    width: 40%;
    height: calc(100% + 40px);
    background: url(${audit});
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    bottom: -32px;
    right: 0;
  }

  a {
    display: block;
  }
`

const CardAudit = ({ className = '' }) => {
  return (
    <Audit className={className}>
      <Text className="mb-2" color="textSubtle">
        Audited by
      </Text>
      <a className="mb-1" href="https://www.certik.org/projects/sixnetwork" target="_blank" rel="noreferrer">
        <img src={certik} width="120" alt="" />
      </a>
      <a href="https://github.com/thesixnetwork/definix-audit/tree/main/Techrate" target="_blank" rel="noreferrer">
        <img src={techRate} width="100" alt="" />
      </a>
    </Audit>
  )
}

export default CardAudit

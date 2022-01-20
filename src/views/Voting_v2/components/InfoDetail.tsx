/* eslint-disable no-nested-ternary */
import React from 'react'
import { CardBody, LinkIcon, Text } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import styled from 'styled-components'
import { Voting } from 'state/types'
import getDateFormat from 'utils/getDateFormat'

interface Props {
  id: string
  proposal: Voting
}

const Wrap = styled(CardBody)`
  padding: 32px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding: 20px;
  }
`

const WrapTable = styled.table`
  border: none;
  width: 100%;
`

const Row = styled.tr`
  height: 56px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:nth-child(1) {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`

const Col = styled.td`
  vertical-align: middle;
  padding: 0 24px;

  &:nth-child(1) {
    width: 20%;
    background-color: ${({ theme }) => theme.colors.lightGrey20};
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    &:nth-child(1) {
      width: 32%;
    }
  }
`

const Link = styled.a`
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }

  > svg {
    margin-left: 6px;
  }
`

const Title = styled(Text)`
  ${({ theme }) => theme.textStyle.R_12M}
  color: ${({ theme }) => theme.colors.mediumgrey};
  white-space: nowrap;
`

const InfoDetail: React.FC<Props> = ({ id, proposal }) => {
  const { t, i18n } = useTranslation()
  const { account } = useWallet()

  return (
    <Wrap>
      <WrapTable>
        <tbody>
          <Row>
            <Col>
              <Title>{t('Identifier')}</Title>
            </Col>
            <Col>
              <Link as="a" href={`${process.env.REACT_APP_IPFS}/${id}`} target="_blank">
                <Text textStyle="R_14R" color="black">
                  {id && `${id.substring(0, 6)}...${id.substring(id.length - 4)}`}
                </Text>
                <LinkIcon />
              </Link>
            </Col>
          </Row>
          <Row>
            <Col>
              <Title>{t('Creator')}</Title>
            </Col>
            <Col>
              <Link as="a" href={`${process.env.REACT_APP_KLAYTN_URL}/account/${account}`} target="_blank">
                <Text textStyle="R_14R" color="black">
                  {proposal.creator &&
                    `${proposal.creator.substring(0, 6)}...${proposal.creator.substring(proposal.creator.length - 4)}`}
                </Text>
                <LinkIcon />
              </Link>
            </Col>
          </Row>
          {/* <Row>
            <Col>
              <Title>{t('Snapshot')}</Text>
            </Col>
            <Col>
              <Text textStyle="R_14R" color="black">test1</Text>
            </Col>
          </Row> */}
          <Row>
            <Col>
              <Title>{t('Start Date')}</Title>
            </Col>
            <Col>
              <Text textStyle="R_14R" color="black">
                {getDateFormat(i18n.languages[0], proposal.startEpoch)}
              </Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Title>{t('End Date')}</Title>
            </Col>
            <Col>
              <Text textStyle="R_14R" color="black">
                {getDateFormat(i18n.languages[0], proposal.endEpoch)}
              </Text>
            </Col>
          </Row>
        </tbody>
      </WrapTable>
    </Wrap>
  )
}

export default InfoDetail

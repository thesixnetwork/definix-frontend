/* eslint-disable no-nested-ternary */
import React, { useState, useMemo } from 'react'
import _ from 'lodash'
import { Flex, CardBody, Text, LinkIcon, Box } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useVotesByIndex, useVotesByIpfs } from 'hooks/useVoting'
import StakeListPagination from 'views/LongTermStake_v2/components/StakeListPagination'
import Translate from './Translate'

interface Props {
  id: string
  proposalIndex: string
}
const Wrap = styled(CardBody)`
  padding: 32px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding: 20px;
  }
`

const ScrollTable = styled(Box)`
  ${({ theme }) => theme.mediaQueries.mobile} {
    overflow-x: auto;
  }
`

const WrapTable = styled.table`
  border: none;
  width: 100%;
`

const HeadRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:nth-child(1) {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.lightGrey20};
  }
`

const Row = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Col = styled.td`
  vertical-align: middle;
  padding: 18px 24px;
  text-align: center;

  &:nth-child(3) {
    text-align: left;
  }
`

const TitleCol = styled.th`
  vertical-align: middle;
  height: 56px;
  padding: 0 24px;
  min-width: 100px;

  &:nth-child(1),
  &:nth-child(2),
  &:nth-child(4) {
    width: 19%;
    min-width: 126px;
  }

  &:nth-child(3) {
    width: 41%;
    min-width: 300px;
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
const InfoVotes: React.FC<Props> = ({ id, proposalIndex }) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const limits = 10
  const { allVotesByIndex, totalVote } = useVotesByIndex(proposalIndex, currentPage, limits)
  const { allVotesByIpfs } = useVotesByIpfs(id)

  const mapAllVote = useMemo(() => {
    const array = []
    if (allVotesByIndex.length !== 0 && allVotesByIpfs.length !== 0) {
      allVotesByIndex.map((v) => {
        _.get(allVotesByIpfs, '0.choices').map((item, index) => {
          if (index === Number(_.get(v, 'voting_opt'))) {
            array.push({
              transaction_hash: _.get(v, 'transaction_hash'),
              voter_addr: _.get(v, 'voter_addr'),
              voting_opt: item,
              voting_power: _.get(v, 'voting_power'),
            })
          }
          return array
        })
        return array
      })
    }
    return array
  }, [allVotesByIndex, allVotesByIpfs])

  return (
    <Wrap>
      {mapAllVote && mapAllVote.length > 0 ? (
        <>
          <ScrollTable>
            <WrapTable>
              <thead>
                <HeadRow>
                  <TitleCol>
                    <Text textStyle="R_12M" color="mediumgrey">
                      {t('Transaction Hash')}
                    </Text>
                  </TitleCol>
                  <TitleCol>
                    <Text textStyle="R_12M" color="mediumgrey">
                      {t('Address')}
                    </Text>
                  </TitleCol>
                  <TitleCol>
                    <Text textStyle="R_12M" color="mediumgrey">
                      {t('Choice')}
                    </Text>
                  </TitleCol>
                  <TitleCol>
                    <Text textStyle="R_12M" color="mediumgrey">
                      {t('Voting Power')}
                    </Text>
                  </TitleCol>
                </HeadRow>
              </thead>
              <tbody>
                {mapAllVote.map((vote) => (
                  <Row key={vote.transaction_hash}>
                    <Col>
                      <Link
                        as="a"
                        href={`${process.env.REACT_APP_KLAYTN_URL}/tx/${vote.transaction_hash}`}
                        target="_blank"
                      >
                        <Text textStyle="R_14R" color="black">
                          {`${vote.transaction_hash.substring(0, 6)}...${vote.transaction_hash.substring(
                            vote.transaction_hash.length - 4,
                          )}`}
                        </Text>
                        <LinkIcon />
                      </Link>
                    </Col>
                    <Col>
                      <Link
                        as="a"
                        href={`${process.env.REACT_APP_KLAYTN_URL}/account/${vote.voter_addr}`}
                        target="_blank"
                      >
                        <Text textStyle="R_14R" color="black">
                          {`${vote.voter_addr.substring(0, 6)}...${vote.voter_addr.substring(
                            vote.voter_addr.length - 4,
                          )}`}
                        </Text>
                        <LinkIcon />
                      </Link>
                    </Col>
                    <Col>
                      <Text textStyle="R_14R" color="black">
                        <Translate text={vote.voting_opt} type="opinion" />
                      </Text>
                    </Col>
                    <Col>
                      <Text textStyle="R_14R" color="black">
                        {vote.voting_power}
                      </Text>
                    </Col>
                  </Row>
                ))}
              </tbody>
            </WrapTable>
          </ScrollTable>
          <Flex alignItems="center" justifyContent="center" mt="20px">
            <StakeListPagination
              isMobile={false}
              itemPerPage={10}
              dataLength={+totalVote}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </Flex>
        </>
      ) : 
      <Flex width="100%" py="20px" height="280px" alignItems="center" justifyContent="center">
        <Text textStyle="R_14R" color="deepgrey">
          {t('no transaction')}
        </Text>
      </Flex>}
    </Wrap>
  )
}

export default InfoVotes

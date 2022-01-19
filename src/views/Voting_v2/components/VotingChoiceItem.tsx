import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, CheckboxLabel, Checkbox, Skeleton, CheckBIcon } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import Translate from './Translate'

interface Props {
  choice: string;
  isVoteMore: boolean;
  isMax: boolean;
  isVoted: boolean;
  isMulti: boolean;
  votingResult: {
    percent: string;
    vote: number;
    value: string;
  };
  isEndDate: boolean;
  index: number;
  onCheckChange: (isChecked: boolean, index: number) => void;
  isChecked: boolean;
}

const WrapChoice = styled(Flex)<{ isLeft: boolean, isDisabled: boolean }>`
  flex-direction: column;
  padding-top: 20px;
  padding-bottom: 10px;

  .mobile-percent {
    display: none;
  }

  .votes {
    color: ${({ theme }) => theme.colors.mediumgrey};
    ${({ theme }) => theme.textStyle.R_14R}
  }

  .wrap-votes {
    margin-left: ${({ isLeft }) => isLeft ? '0' : '36px'};
    margin-top: 6px;
  }

  ${({ isDisabled }) => isDisabled && `
    opacity: 0.3;
    pointer-events: none;
  `}
  

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding-top: 0;
    padding-bottom: 24px;

    .choice {
      ${({ theme }) => theme.textStyle.R_14R}
    }

    .votes {
      ${({ theme }) => theme.textStyle.R_12R}
    }

    .percent {
      display: none;
    }

    .wrap-votes {
      justify-content: space-between;
      margin-left: ${({ isLeft }) => isLeft ? '0' : '36px'};
    }

    .mobile-percent {
      display: block;
    }
  }
`

const Range = styled(Box)`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrey30};
  border-radius: 4px;
`

const RangeValue = styled(Box)<{ width: number, isParticipated: boolean, isMax: boolean }>`
  width: ${({ width }) => width}%;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ theme, isParticipated, isMax }) => isParticipated && isMax ? theme.colors.red : theme.colors.lightbrown};
`

const VotingChoiceItem: React.FC<Props> = ({ choice, index, isVoteMore, isMax, votingResult, isChecked, isVoted, isEndDate, isMulti, onCheckChange }) => {
  const { t } = useTranslation();
  const isLeft = useMemo(() => isVoteMore || isEndDate, [isEndDate, isVoteMore]);

  const renderChoice = useCallback(() => {
    if (isEndDate) {
      return <Text className="choice" textStyle="R_16R" color="black">
        <Translate text={choice} type="opinion" />
      </Text>
    }
    if (isVoteMore) {
      if (isVoted) {
        return <Flex alignItems="center">
          <CheckBIcon style={{
            flexShrink: 0
          }} />
          <Text className="choice" textStyle="R_16R" color="black" ml="8px">
            <Translate text={choice} type="opinion" />
          </Text>
        </Flex>
      }
      return <Text className="choice" textStyle="R_16R" color="black">
        <Translate text={choice} type="opinion" />
      </Text>
    }
    return <CheckboxLabel control={<Checkbox checked={isChecked} onChange={(e) => onCheckChange(e.target.checked, index)} />} className="mr-12">
      <Text className="choice" textStyle="R_16R" color="black">
        <Translate text={choice} type="opinion" />
      </Text>
    </CheckboxLabel>
  }, [isEndDate, isVoteMore, isChecked, choice, isVoted, onCheckChange, index]);

  return (
    <WrapChoice key={choice} isLeft={isLeft} isDisabled={!isMulti && !isVoted && !isVoteMore}>
      <Flex justifyContent="space-between" alignItems="center">
        {renderChoice()}
        <div className="percent">
          {
            votingResult ? <Text textStyle="R_16M" color="deepgrey">{votingResult ? `${!(window as any).isNaN(votingResult.percent) ? votingResult.percent : '0'  }%` : ' '}</Text> : <Skeleton width="100px" height="100%" animation="waves" />
          }
        </div>
      </Flex>
      <Flex ml={isLeft ? '0' : "36px"} mt="14px">
        <Range>
          <RangeValue width={votingResult ? +votingResult.percent : 0} isParticipated={isVoteMore} isMax={isMax} />
        </Range>
      </Flex>
      <Flex minHeight="20px" className="wrap-votes">
        {
          votingResult ? <Text className="votes">{votingResult ? `${votingResult.vote} ${t('N Votes')}` : ' '}</Text> : <Skeleton width="100px" height="100%" animation="waves" />
        }
        <div className="mobile-percent">
          {
            votingResult ? <Text textStyle="R_12M" color="deepgrey">{votingResult ? `${votingResult.percent  }%` : ' '}</Text> : <Skeleton width="100px" height="100%" animation="waves" />
          }
        </div>
      </Flex>
    </WrapChoice>
  )
}

export default VotingChoiceItem

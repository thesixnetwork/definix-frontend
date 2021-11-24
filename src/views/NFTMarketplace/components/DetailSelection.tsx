// import useI18n from 'hooks/useI18n'
import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Button } from '../../../uikit-dev'

export interface ExpandableSectionProps {
  isHorizontal?: boolean
  className?: string
  data: any
  chartName: string
}

const Wrapper = styled.div<{ isHorizontal?: boolean }>`
  background: ${({ isHorizontal, theme }) => (!isHorizontal ? theme.colors.cardFooter : 'transparent')};
  border-top: ${({ theme, isHorizontal }) => (!isHorizontal ? `1px solid ${theme.colors.border}` : 'none')};
  border-bottom-left-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
  border-bottom-right-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  isHorizontal = false,
  className = '',
  data,
  chartName,
}) => {
  //   const TranslateString = useI18n()
  console.log('++++++++++', data)

  return (
    <Wrapper isHorizontal={isHorizontal} className={className}>
      {/* {!removed && ( */}
      <>
        {/* <Text style={{position:'absolute', top: 50,left:50}}>TEST</Text> */}
        <div className="flex align-baseline flex-wrap justify-space-between mb-1">
          {chartName === 'Price' && (
            <div
              style={{
                borderRadius: 40,
                padding: '8px 5px',
                backgroundColor: '#0973B9',
                position: 'absolute',
                top: '78%',
                right: 0,
              }}
            >
              + {data.count}
            </div>
          )}
          {/* <Text color="textSubtle">{TranslateString(23, 'My Liquidity')}</Text> */}

          <div className="flex flex-wrap justify-end" style={{ marginRight: '-6px' }}>
            <Heading bold className="flex-shrink">
              #02ffff
              {/* {fstakedBalanceValueFormated} */}
            </Heading>
            {/* <LinkView /> */}
          </div>
        </div>

        <div className="flex align-baseline flex-wrap justify-space-between">
          {/* <Text color="textSubtle">{TranslateString(23, 'Total Liquidity')}</Text> */}

          <div className="flex flex-wrap justify-end" style={{ marginRight: '-6px' }}>
            <Text bold className="flex-shrink">
              T-ARA LEGENDARY Grade Limited
              {/* {totalValueFormated} */}
            </Text>
            {/* <LinkView /> */}
          </div>
        </div>

        <div className="flex align-baseline flex-wrap justify-space-between">
          {/* <Text color="textSubtle">{TranslateString(23, 'Total Liquidity')}</Text> */}

          <div className="flex flex-wrap justify-end" style={{ marginRight: '-6px' }}>
            <Text bold className="flex-shrink">
              Dingo x SIX Network NFT Project No.1
              {/* {totalValueFormated} */}
            </Text>
            {/* <LinkView /> */}
          </div>
        </div>
      </>
      {/* )} */}
    </Wrapper>
  )
}

export default DetailsSection

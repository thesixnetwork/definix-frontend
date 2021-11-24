import React from 'react'
import styled from 'styled-components'
import { Text, Heading } from '../../../uikit-dev'

export interface ExpandableSectionProps {
  isHorizontal?: boolean
  className?: string
  data: any
  typeName: string
}

const Wrapper = styled.div<{ isHorizontal?: boolean }>`
  background: ${({ isHorizontal, theme }) => (!isHorizontal ? theme.colors.cardFooter : 'transparent')};
  border-top: ${({ theme, isHorizontal }) => (!isHorizontal ? `1px solid ${theme.colors.border}` : 'none')};
  border-bottom-left-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
  border-bottom-right-radius: ${({ theme, isHorizontal }) => (!isHorizontal ? theme.radii.card : '0')};
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({ isHorizontal = false, className = '', data, typeName }) => {
  return (
    <Wrapper isHorizontal={isHorizontal} className={className}>
      <>
        <div className="flex align-baseline flex-wrap justify-space-between mb-1">
          {typeName === 'Group' && (
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

          <div className="flex flex-wrap justify-end" style={{ marginRight: '-6px' }}>
            <Heading bold className="flex-shrink">
              #02ffff
            </Heading>
          </div>
        </div>

        <div className="flex align-baseline flex-wrap justify-space-between">
          <div className="flex flex-wrap justify-end" style={{ marginRight: '-6px' }}>
            <Text bold className="flex-shrink">
              T-ARA LEGENDARY Grade Limited
            </Text>
          </div>
        </div>

        <div className="flex align-baseline flex-wrap justify-space-between">
          <div className="flex flex-wrap justify-end" style={{ marginRight: '-6px' }}>
            <Text bold className="flex-shrink">
              Dingo x SIX Network NFT Project No.1
            </Text>
          </div>
        </div>
      </>
    </Wrapper>
  )
}

export default DetailsSection

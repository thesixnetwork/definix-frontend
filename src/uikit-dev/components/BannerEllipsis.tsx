import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import DisclaimersModal from 'views/Explore/components/DisclaimersModal'
import useModal from '../widgets/Modal/useModal'
import IconButton from './Button/IconButton'
import ChevronDownIcon from './Svg/Icons/ChevronDown'
import ChevronUpIcon from './Svg/Icons/ChevronUp'
import Text from './Text/Text'

const Banner = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  padding: 8px 8px 8px 16px;

  img {
    width: 32px;
  }
`

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const BannerEllipsis = () => {
  const [isEllipsis, setIsEllipsis] = useState(true)
  const [onPresentDisclaimersModal] = useModal(<DisclaimersModal />)

  useEffect(() => {
    setIsEllipsis(true)
  }, [])

  return (
    <Banner>
      <MaxWidth className="flex">
        {isEllipsis ? (
          <Text color="white" fontSize="13px">
            <strong>Rebalancing Farm :</strong>{' '}
            <span className="mr-1">Rebalancing farm is a special farm that implements rebalancing strategy.</span>
          </Text>
        ) : (
          <Text color="white" fontSize="13px">
            <strong>Rebalancing Farm :</strong>{' '}
            <span className="mr-1">
              Rebalancing farm is a special farm that implements rebalancing strategy. The advantage of the strategy is
              that it can help you minimize risk and get favored positions for your investment in the long run.
            </span>
            <strong className="mr-1">About the disclosures of the rebalancing farm, you can</strong>
            <span
              role="none"
              style={{
                color: '#ffd157',
                fontWeight: 'bold',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={onPresentDisclaimersModal}
            >
              read more here.
            </span>
            <span style={{ fontSize: '11px', display: 'block', opacity: '0.7' }}>
              Definix is solely a marketplace which provides a tool. The rebalancing farm has been managed by a 3rd
              party called Enigma.
            </span>
          </Text>
        )}

        <IconButton
          className="ml-2 flex flex-shrink align-center"
          variant="text"
          size="xs"
          onClick={() => {
            setIsEllipsis(!isEllipsis)
          }}
        >
          {isEllipsis ? <ChevronDownIcon color="white" /> : <ChevronUpIcon color="white" />}
        </IconButton>
      </MaxWidth>
    </Banner>
  )
}
export default BannerEllipsis

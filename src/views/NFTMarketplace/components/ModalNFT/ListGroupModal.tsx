import React, { useState, useMemo, useEffect } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Button, Text, Heading, Flex, useMatchBreakpoints } from 'uikit-dev'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import useTheme from 'hooks/useTheme'
import ModalNFT from 'uikit-dev/widgets/Modal/Modal'
import ListFillModal from './ListFillModal'
import TableList from '../TableList'
import ModalComplete from './ModalComplete'

interface Props {
  onDismiss?: () => void
  isMarketplace?: boolean
  data: any
  code: any
  typeName: any
}

const ImgWrap = styled(Flex)`
  width: 340px;
  height: 330px;
  flex-shrink: 0;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: unset;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 340px;
  }
`

const LayoutImg = styled.div`
  text-align: -webkit-center;
`

const ListGroupModal: React.FC<Props> = ({ onDismiss = () => null, data, code, typeName }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [onPresentConnectModal] = useModal(<ListFillModal data={data} />)
  const [dismiss, setOnDismiss] = useState(false)
  const [handleBuy] = useModal(<ModalComplete />)
  const { isXl } = useMatchBreakpoints()
  const { isDark } = useTheme()
  const isMobile = !isXl

  useEffect(() => {
    if (dismiss) {
      onDismiss()
    }
  }, [dismiss, onDismiss])

  const filterCode = useMemo(() => {
    return data.filter((person) => person.code === code.filterdList[4])
  }, [data, code])

  return (
    <ModalNFT
      isRainbow={false}
      title=""
      onDismiss={onDismiss}
      hideCloseButton={hideCloseButton}
      classHeader="bd-b-n pa-0"
      bodyPadding={isMobile ? '30px 18px' : '42px'}
    >
      <div className={isMobile ? 'w-100' : 'w-100 flex'}>
        <LayoutImg>
          <ImgWrap>
            <video autoPlay muted loop playsInline>
              <source src={code.filterdList[1]} type="video/mp4" />
            </video>
          </ImgWrap>
        </LayoutImg>
        <div className={isMobile ? 'mt-6' : 'ml-6'}>
          <Text bold fontSize="20px !important" lineHeight="1">
            {code.filterdList[2]} {code.filterdList[3]}
          </Text>
          <Text fontSize="14px !important" color="textSubtle" lineHeight="2">
            Dingo x SIX Network NFT Project No.1
          </Text>
          <TableList rows={filterCode} isLoading={isLoading} isDark={isDark} total={10} setOnDismiss={setOnDismiss} typeName={typeName} />
        </div>
      </div>
    </ModalNFT>
  )
}

export default ListGroupModal

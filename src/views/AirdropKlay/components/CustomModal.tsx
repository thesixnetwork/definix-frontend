import React from 'react'
import styled from 'styled-components'
import Flex from 'uikit-dev/components/Box/Flex'
import { IconButton } from 'uikit-dev/components/Button'
import Heading from 'uikit-dev/components/Heading/Heading'
import { ArrowBackIcon, CloseIcon } from 'uikit-dev/components/Svg'
import colorStroke from 'uikit-dev/images/Color-stroke.png'
import { InjectedProps } from 'uikit-dev/widgets/Modal/types'
import collectImg from 'uikit-dev/images/Airdrop/collect.png'
import incollectImg from 'uikit-dev/images/Airdrop/incollect.png'

interface Props extends InjectedProps {
    title: string
    hideCloseButton?: boolean
    onBack?: () => void
    bodyPadding?: string
    isRainbow?: boolean
    hidden?: boolean
    isSuccess?: boolean
}

const StyledModal = styled.div`
  background: ${({ theme }) => theme.modal.background};
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
  border-radius: ${({ theme }) => theme.radii.default};
  width: 400px;
  z-index: ${({ theme }) => theme.zIndices.modal};
  overflow-y: auto;
  textAlign: center;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: auto;
    min-width: 360px;
    max-width: 400px;
  }
  position: relative;

  .color-stroke {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    height: 4px;
    width: 100%;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  padding: 12px 12px 0 24px;
`

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
`

const RenderCollectImg = ()=>{
    return (<img
        style={{ width: '60px', marginLeft: 'auto', marginRight: 'auto',marginTop:"20px" }}
        src={collectImg}
        alt=""
        className="logo"
    />)
}
const RenderInCollectImg = ()=>{
    return (<img
        style={{ width: '60px', marginLeft: 'auto', marginRight: 'auto',marginTop:"20px" }}
        src={incollectImg}
        alt=""
        className="logo"
    />)
}
const CustomModal: React.FC<Props> = ({
    title,
    onDismiss,
    onBack,
    children,
    hideCloseButton = false,
    bodyPadding = '24px',
    isRainbow = true,
    hidden = false,
    isSuccess = false
}) => (
    <>
        <div hidden={hidden} style={{ width: "100%", height: "100%", backgroundColor: "black", zIndex: 99998, position: "absolute", opacity: '0.2' }} />
        <div
            style={{
                position: "absolute",
                left: "50%",
                marginLeft: "-200px",
                top: "40%",
                transform: "translate(-50%, -50%);",
                zIndex: 99999
            }}>
            <StyledModal hidden={hidden}>
                <Flex>
                   {isSuccess?<RenderCollectImg/>:<RenderInCollectImg/>}
                </Flex>
                <ModalHeader>

                    <ModalTitle>
                        {onBack && (
                            <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
                                <ArrowBackIcon color="primary" />
                            </IconButton>
                        )}

                        <Heading style={{textAlign:"center", marginLeft: "auto", marginRight: "auto" }} as="h2">{title}</Heading>
                    </ModalTitle>
                    {/* {!hideCloseButton && (
                        <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
                            <CloseIcon color="primary" />
                        </IconButton>
                    )} */}
                </ModalHeader>

                <Flex flexDirection="column" p={bodyPadding}>
                    {children}
                </Flex>
                {isRainbow && <img className="color-stroke" alt="" src={colorStroke} />}
            </StyledModal>
        </div>
    </>
)

export default CustomModal

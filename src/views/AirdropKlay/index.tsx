import Page from 'components/layout/Page'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Card, Text } from 'uikit-dev'
import BannerAirdrop from './components/BannerAirdrop'
import CardContentAirdrop from './components/CardContentAirdrop'
import CustomModal from './components/CustomModal'

// const MaxWidth = styled.div`
//   max-width: 800px;
//   margin: 0 auto;
//   width: 100%;
//   padding: 0 24px;
//   ${({ theme }) => theme.mediaQueries.md} {
//     padding: 0;
//   }
//   section {
//     padding: 48px 0;
//   }
//   .info {
//     margin-bottom: 2rem;
//   }
//   .color-stroke {
//     heigth: 4px;
//   }
// `

// const Flex = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin-bottom: 3rem;
//   img {
//     display: block;
//     margin: 0 auto 2rem auto;
//     width: 70%;
//   }
//   ${({ theme }) => theme.mediaQueries.md} {
//     flex-direction: row;
//     img {
//       width: auto;
//       height: 200px;
//     }
//   }
//   .col-6 {
//     width: 100% !important;
//     margin-bottom: 3rem;
//     > div {
//       margin-bottom: 4rem;
//       &:last-of-type {
//         margin-bottom: 0;
//       }
//     }
//     ${({ theme }) => theme.mediaQueries.md} {
//       width: 50% !important;
//       margin-bottom: 0;
//       &:nth-child(01) {
//         padding-right: 2rem;
//         border-right: 1px solid ${({ theme }) => theme.colors.border};
//       }
//       &:nth-child(02) {
//         padding-left: 2rem;
//       }
//     }
//   }
// `
const Panel = styled.div`
  width: 100%;
  padding: 24px;
  // background: url();
  background-size: cover;
  background-repeat: no-repeat;
  transition: 0.1s;
`

// const StyledButton = styled(Button)`
//   display: block;
//   margin: 0 auto;
//   color: ${({ theme }) => theme.colors.primary} !important;
//   border-color: ${({ theme }) => theme.colors.primary} !important;
//   background: transparent !important;
// `

const AirdropKlay: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [bodyModal, setBodyModal] = useState('')
  const [modalSuccess, setModalSuccess] = useState(false)
  const toggleModal = () => {
    setShowModal(!showModal)
  }
  return (
    <>
      <CustomModal isSuccess={modalSuccess} title={title} hidden={!showModal} isRainbow={false}>
        <div>
          <Text fontSize="15px" lineHeight="25px" textAlign="center">
            {bodyModal}
          </Text>
          <br />
          <br />
          <Button style={{ width: '100%' }} onClick={toggleModal}>
            Close
          </Button>
        </div>
      </CustomModal>
      <Panel id="root">
        <Page style={{ maxWidth: '1280px' }}>
          <Card className="flex flex-column align-stretch mx-auto" style={{ maxWidth: '1000px' }}>
            <BannerAirdrop />
          </Card>

          <Card className="flex flex-column align-stretch mx-auto" style={{ marginTop: '30px', maxWidth: '1000px' }}>
            <CardContentAirdrop
              setModalSuccess={setModalSuccess}
              setTitleModal={setTitle}
              setBodyModal={setBodyModal}
              toggleModal={toggleModal}
            />
          </Card>
        </Page>
      </Panel>
    </>
  )
}

export default AirdropKlay

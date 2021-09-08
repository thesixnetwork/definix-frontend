import Page from 'components/layout/Page'
import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit-dev'
import BannerAirdrop from './components/BannerAirdrop'
import CardContentAirdrop from './components/CardContentAirdrop'
import CustomModal from './components/CustomModal'

const Panel = styled.div`
  width: 100%;
  padding: 24px;
  // background: url();
  background-size: cover;
  background-repeat: no-repeat;
  transition: 0.1s;
`

const AirdropKlay: React.FC = () => {
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

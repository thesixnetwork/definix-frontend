import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowBackIcon, Button, Card, Text } from 'uikit-dev'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import TwoLineFormat from './components/TwoLineFormat'

const MaxWidth = styled.div`
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`

const LeftPanelAbsolute = styled(LeftPanel)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 24px;
`

const Invest: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <TwoPanelLayout>
        <LeftPanelAbsolute isShowRightPanel={false}>
          <MaxWidth>
            <Card className="mb-4">
              <div className="pa-4 pt-2 bd-b">
                <Button
                  variant="text"
                  as={Link}
                  to="/explore/detail"
                  ml="-12px"
                  mb="8px"
                  padding="0 12px"
                  startIcon={<ArrowBackIcon />}
                >
                  <Text fontSize="14px" color="textSubtle">
                    Back
                  </Text>
                </Button>

                <TwoLineFormat title="Share price" value="$1,928.03" percent="+0.2%" large className="mb-4" />

                <div className="flex">
                  <Text className="mb-2">Withdraw</Text>
                </div>
              </div>
            </Card>
          </MaxWidth>
        </LeftPanelAbsolute>
      </TwoPanelLayout>
    </>
  )
}

export default Invest

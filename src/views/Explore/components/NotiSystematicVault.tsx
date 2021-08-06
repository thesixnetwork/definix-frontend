/* eslint-disable react/require-default-props */

import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev'
import CountDownBanner from 'uikit-dev/components/CountDownBanner'
import logoNoti from 'uikit-dev/images/for-ui-v2/noti.png'

const Sticky = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
`

const NotiSystematicVault = () => {
  return (
    <Sticky>
      <CountDownBanner
        logo={logoNoti}
        customText={
          <Text color="white" fontSize="12px">
            <strong>New Feature : Systematic Vault (Beta) :</strong>{' '}
            <span className="mr-1">
              Systematic vault is a vault that has been built by using rebalancing strategy. This feature is still in
              beta period. For the security of your assets,
            </span>
            <strong className="mr-1" style={{ color: '#ffd157' }}>
              {' '}
              the maximum amount of investment will be $100 per vault
            </strong>
            <span>
              during the beta period. This limit will be removed once the auditor finishes the smart contract of
              systematic vault.
            </span>
          </Text>
        }
        disableCountdown
      />
    </Sticky>
  )
}

export default NotiSystematicVault

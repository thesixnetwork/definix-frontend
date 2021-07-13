import React, { ReactElement } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text } from 'uikit-dev'

interface Props {
  open: boolean
  disable: boolean
}

const TriggerElement = ({ isDown }): ReactElement => {
  const { t } = useTranslation()

  return (
    <div style={{ width: '100%', cursor: 'pointer' }}>
      <div style={{ fontSize: '20px' }}>
        {t('Criteria for 2nd airdrop claim')}
        {/* <img src={Airdrop2img} style={{ width: '50px', marginLeft: '15px' }} alt="" /> */}
        <div style={{ float: 'right' }}>
          {/* <div style={{ marginTop: '15px' }}>{isDown ? <ChevronDownIcon /> : <ChevronUpIcon />}</div> */}
        </div>
      </div>

      <hr style={{ width: '100%', marginTop: '20px', marginBottom: '20px', opacity: '0.3' }} />
    </div>
  )
}
export default function DiscriptionSecondAirdrop({ open = true, disable = true }: Props): ReactElement {
  const { t } = useTranslation()

  return (
    // <Collapsible trigger={} open={open} disabled={disable}>
    <div>
      <TriggerElement isDown={open} />
      <div>
        <Text lineHeight="2">
          {t('1. Must have LP staked on Definix Klaytn-based during')}{' '}
          <b>{t('21st June 2021 3:00:00 p.m. — 20th August 2021 9:59:59 a.m.(GMT +7).')}</b>
        </Text>
        <Text lineHeight="2">
          {t(
            '2. The airdrop will be automatically distributed 30 KLAY within 48 hours to the wallet address that used on',
          )}{' '}
          <a style={{ color: '#0973B9' }} href="https://klaytn.definix.com">
            klaytn.definix.com
          </a>{' '}
          {t('after supply liquidity and received LP token from')}{' '}
          <a style={{ color: '#0973B9' }} href="https://klaytn.definix.com">
            klaytn.definix.com
          </a>
        </Text>
        <Text lineHeight="2">
          {t('3. Users must connect the same wallet used in claiming the airdrop from the first campaign.')}
        </Text>
        <Text lineHeight="2">{t('4. Airdrop is limited and distributed in a first come first serve method.')}</Text>

        <Text lineHeight="2">
          {t(
            '5. All the airdrop activity is performed and triggered by the action of a smart contract. In case the user puts in the account that the user doesn’t have a private key; the airdrop cannot be claimed and will be lost forever.',
          )}
        </Text>
        <Text lineHeight="2">
          {t(
            '6. Airdrops will be distributed to all users equally which sums up to $200K plus unclaimed airdrop from the first campaign per account.',
          )}
        </Text>
      </div>
      <br />
      <br />
    </div>
  )
}

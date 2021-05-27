import React from 'react'
import { Tag, VerifiedIcon, CommunityIcon, BinanceIcon } from 'uikit-dev'

const CoreTag = () => (
  <Tag variant="secondary" outline startIcon={<VerifiedIcon />}>
    Core
  </Tag>
)

const CommunityTag = () => (
  <Tag variant="textSubtle" outline startIcon={<CommunityIcon />}>
    Community
  </Tag>
)

const KlaytnTag = () => (
  <Tag variant="klaytn" outline startIcon={<BinanceIcon />}>
    Binance
  </Tag>
)

export { CoreTag, CommunityTag, KlaytnTag }

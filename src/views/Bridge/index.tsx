import { Box, Button, Link, Typography } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet'
import Card from 'uikitV2/components/Card'
import PageTitle from 'uikitV2/components/PageTitle'
import SmallestLayout from 'uikitV2/components/SmallestLayout'
import bridgeImg from 'uikitV2/images/bridge.png'
import sixBridge from 'uikitV2/images/six-bridge.png'
import six from 'uikitV2/images/six-coin.png'
import finix from 'uikitV2/images/finix-coin.png'

const Item = ({ title, caption, img }) => {
  return (
    <Box display="flex" alignItems="flex-start" pr={4} sx={{ '&:last-child': { mt: { xs: 2, md: 0 } } }}>
      <img src={img} alt="" width={48} height={48} />
      <Box pl="12px">
        <Typography variant="body2" fontWeight="bold" mb="2px">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {caption}
        </Typography>
      </Box>
    </Box>
  )
}

const Bridge = () => {
  const list = [
    {
      title: 'SIX',
      caption: 'Binance Smart Chain, Klaytn Chain, Stella Lumen',
      img: six,
    },
    {
      title: 'FINIX',
      caption: 'Binance Smart Chain, Klaytn Chain',
      img: finix,
    },
  ]

  return (
    <SmallestLayout>
      <Helmet>
        <title>Bridge - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <PageTitle title="Bridge" caption="Transfer tokens to other chains quick and easy." img={bridgeImg} />

      <Card>
        <Box p={{ xs: '20px', md: '40px' }} display="flex" flexDirection="column">
          <img src={sixBridge} alt="" className="mx-auto" style={{ marginTop: '10px' }} />

          <Box py={{ xs: '1.5rem', md: '2.5rem' }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Token & Chain
            </Typography>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
              {list.map((l) => (
                <Item key={l.title + l.caption} title={l.title} caption={l.caption} img={l.img} />
              ))}
            </Box>
          </Box>

          <Button
            size="large"
            variant="contained"
            component={Link}
            href="https://bridge.six.network"
            target="_blank"
            fullWidth
          >
            Go to the bridge
          </Button>
        </Box>
      </Card>
    </SmallestLayout>
  )
}

export default Bridge

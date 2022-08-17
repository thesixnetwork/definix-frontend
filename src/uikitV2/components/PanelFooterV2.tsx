import { Box, MenuItem, Select, styled, Typography } from '@mui/material'
import { allLanguages } from 'config/localisation/languageCodes'
import React from 'react'
import { PanelProps } from 'uikit-dev/widgets/Menu/types'

// import { SettingsRounded } from '@mui/icons-material'
// import { IconButton } from '@mui/material'

const Container = styled(Box)`
  padding: 20px 8px 20px 16px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const PanelFooterV2: React.FC<PanelProps> = ({ currentLang, setLang }) => {
  return (
    <Container>
      <Select
        value={currentLang}
        size="small"
        sx={{ width: '100px' }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
        onChange={(e) => {
          const lang = allLanguages.filter((l) => l.code === e.target.value)[0]
          setLang(lang)
        }}
      >
        {allLanguages.map((lang) => (
          <MenuItem value={lang.code} key={lang.code}>
            <Typography variant="body2" fontWeight={500}>
              {lang.language}
            </Typography>
          </MenuItem>
        ))}
      </Select>

      {/* <IconButton onClick={()=>{}}>
        <SettingsRounded />
      </IconButton> */}
    </Container>
  )
}

export default PanelFooterV2

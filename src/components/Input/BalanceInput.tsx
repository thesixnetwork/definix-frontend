import React from 'react'
import styled from 'styled-components'
import { Button } from 'uikit-dev'
import { useTranslation } from 'contexts/Localization'
import Input, { InputProps } from './Input'

interface Props extends InputProps {
  max: number | string
  symbol: string
  onSelectMax?: () => void
}

const StyledSpacer = styled.div`
  width: ${(props) => props.theme.spacing[3]}px;
`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`

const StyledMaxText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  justify-content: flex-end;
`

const StyledTokenSymbol = styled.span`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 700;
`

const BalanceInput: React.FC<Props> = ({ max, symbol, onChange, onSelectMax, value }) => {
  const { t } = useTranslation()

  return (
    <div>
      <Input
        endAdornment={
          <StyledTokenAdornmentWrapper>
            <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
            <StyledSpacer />
            <div>
              <Button size="sm" onClick={onSelectMax}>
                {t('Max')}
              </Button>
            </div>
          </StyledTokenAdornmentWrapper>
        }
        onChange={onChange}
        placeholder="0"
        value={value}
      />
      <StyledMaxText>{t(`${max.toLocaleString()} ${symbol} Available`)}</StyledMaxText>
    </div>
  )
}

export default BalanceInput

import React from 'react'
import rainbowImg from '../../images/Color-stroke.png'
import StyledCard from './StyledCard'
import { CardProps } from './types'

const Card: React.FC<CardProps> = ({ ribbon, children, ...props }) => {
  const { isRainbow } = props
  return (
    <StyledCard {...props}>
      {ribbon}
      {children}
      {isRainbow && <img className="rainbow" alt="" src={rainbowImg} />}
    </StyledCard>
  )
}
export default Card

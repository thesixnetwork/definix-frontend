import React from 'react'
import styled from 'styled-components'

const MainStepStyle = styled.img`
  cursor: pointer;
`

const MainStep = ({ src = '', className = '', onClick = undefined }) => {
  return <MainStepStyle src={src} alt="" onClick={onClick} className={className} />
}

export default MainStep

import React from 'react'
import { Helmet } from 'react-helmet'
import { Route, useRouteMatch } from 'react-router-dom'

const Marketplace: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <div>Marketplace
    </div>
  )
}

export default Marketplace

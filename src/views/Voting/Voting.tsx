import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import StartVoting from './components/StartVoting'

const Voting: React.FC = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <Route exact path={path}>

        <StartVoting />
      </Route>
    </>
  )
}

export default Voting

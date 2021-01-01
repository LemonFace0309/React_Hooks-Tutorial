import React, { useContext } from 'react'

import Ingredients from './components/Ingredients/Ingredients'
import Auth from './components/Auth'
import { AuthContext } from './context/auth-context'

const App = (props) => {
  const authContext = useContext(AuthContext)
  // useContext is to functional components what static contextType is to class components

  let content = <Auth />
  if (authContext.isAuth) {
    content = <Ingredients />
  }

  return content
}

export default App

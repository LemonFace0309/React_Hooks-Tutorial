import React, { useState } from 'react'

export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {},
})
// AuthContext is an object (anything, actually, it just usually takes the form of an object) available wherever you decide

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const loginHandler = () => {
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider
      value={{ login: loginHandler, isAuth: isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider

import React from "react"

const AuthContext = React.createContext({
  auth: null,
  // {
  //   user: null,
  //   accessToken: {
  //     value: null,
  //     exp: null
  // }
  setAuth: () => { }
})

export { AuthContext }
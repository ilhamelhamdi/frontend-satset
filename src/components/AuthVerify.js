import { useEffect, useState } from 'react'
import { useLocation } from "react-router"
import { AuthContext } from '../context'

const AuthVerify = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth')))
  const location = useLocation()

  useEffect(() => {
    if (auth == null) localStorage.removeItem('auth')
    else localStorage.setItem('auth', JSON.stringify(auth))
  }, [auth])

  // Check token expiration every route changes & Logout if needed
  useEffect(() => {
    if (auth) {
      if (auth.accessToken.exp < Date.now()) {
        setAuth(null)
        console.log(location);
      }
    }
  }, [location])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthVerify
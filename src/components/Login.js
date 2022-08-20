import { useContext, useEffect, useState } from "react"
import { API_URL } from "../config"
import { AuthContext } from "../context"
import Icons from "../images/icons"
import Button from "./Button"
import ModalBox from "./ModalBox"


const Login = ({ setShowLogin }) => {
  const tokenTTL = 6 * 3600 * 1000

  const { setAuth } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // Post Data and Fetch Token
      const requestBody = { email, password }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
      const res = await fetch(`${API_URL}/login`, requestOptions)

      const user = (await res.json()).data
      const accessToken = res.headers.get('Token')

      setAuth({
        user,
        accessToken: {
          value: accessToken,
          exp: Date.now() + tokenTTL
        }
      })

    } catch (e) {
      console.log(e.message);
    } finally {
      setIsLoading(false)
      setShowLogin(false)
    }
  }


  return (
    <ModalBox>
      <h2 className="text-2xl text-teal-700 font-bold text-center">Log In</h2>
      <div id="email" className="mb-4">
        <h2 className="text-lg  mb-2">Email</h2>
        <input
          type="email"
          placeholder="Insert your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="inline-block w-full outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
        />
      </div>
      <div id="password" className="mb-4">
        <h2 className="text-lg  mb-2">Password</h2>
        <input
          type="password"
          placeholder="Insert your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="inline-block w-full outline outline-2 outline-slate-200 focus:outline-teal-700 px-4 py-2 rounded-lg"
        />
      </div>
      <div className="space-x-2 flex justify-end">
        {isLoading
          ? <Button className="cursor-not-allowed">
            <Icons.Loading className="animate-spin h-5 w-5 mr-3 inline-block" />
            Loading...
          </Button>
          : <>
            <Button onClick={() => setShowLogin(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleLogin} className="font-bold">Log In</Button>
          </>
        }
      </div>
    </ModalBox>
  )
}

export default Login
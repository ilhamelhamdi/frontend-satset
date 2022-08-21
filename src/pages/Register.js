import React, {useState, useContext} from 'react'
import { API_URL } from "../config"
import { useNavigate } from 'react-router-dom'
import { Loading } from "../components/Loading"
import { AuthContext } from "../context"
import Toast from "../components/Toast"

const Register = () => {
  const [image, setImage] = useState({preview: '', raw: ''})
  const [name, setName] = useState('')
  const [gender, setGender] = useState('m')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [errorName, setErrorName] = useState(null)
  const [errorPassword, setErrorPassword] = useState(null)
  const [errorEmail, setErrorEmail] = useState(null)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useContext(AuthContext)
  const tokenTTL = 6 * 3600 * 1000

  const handleImage = e => {
    if(e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
  }

  const registerHandler = async (event) => {
    event.preventDefault();
    let isValid = true

    if(name === ''){
      setErrorName('Please input valid name')
      isValid = false
    }
    if(password === ''){
      setErrorPassword('Please input valid password')
      isValid = false
    }
    if(email === ''){
      setErrorEmail('Please input valid email')
      isValid = false
    }
    if(!isValid) return
    
    setIsLoading(true)
    const imageUrl = await ImageUploadHandler()
    const formData = {}

    formData.name = name
    formData.gender = gender
    formData.email = email
    formData.password = password
    formData.role = role
    formData.image = imageUrl

    try{
      const res = await fetch(API_URL + '/register', {
        method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
      if(res.status === 200) {
        const user = (await res.json()).data
        const accessToken = res.headers.get('Token')
        if(role === 'student'){
          setAuth({
            user,
            accessToken: {
              value: accessToken,
              exp: Date.now() + tokenTTL
            }
          })
          Toast('success', 'Successfully registered!')
          navigate('/')
        } else {
          Toast('info', 'Successfully registered! Wait approval from admin.')
        }
      } else {
        Toast('error', 'Email already registered')
      }
    } catch (e) {
      Toast('error', e)
    } finally {
      setIsLoading(false)
    }
  }

  const ImageUploadHandler = async () => {
    if(image.raw !== ''){
      const data = new FormData();
      data.append('image', image.raw)
      try{
        const res =  await fetch('https://api.imgur.com/3/image', {
          method: "POST",
          headers: {
            'Authorization': 'Client-ID 35d873feaf37beb'
          },
          referrerPolicy: "no-referrer",
          body: data
        })
        if (res.status !== 200) throw Error('Failed to upload image')
        const json = await res.json()
        return json.data.link
      } catch(e){
        Toast('error', e)
        setIsLoading(false)
      }
    }
    return 'https://i.imgur.com//teA8hQ0.png'
  }

  return (
    <div>
      {
        isLoading ?
          <Loading/>
        :
          <div className="container mx-auto w-screen h-screen grid md:grid-cols-2">
            <div className="w-full h-full flex justify-center items-center p-16 flex-col">
              <img src="webinar.jpg" alt="instructor teaching online"/>
              <p className="text-gray-400 italic">“Education is the kindling of a flame, not the filling of a vessel.”</p>
              <p className="text-gray-400">— Socrates</p>
            </div>
            <form onSubmit={(e) => registerHandler(e)}>
              <div className="w-full h-full flex justify-center items-center p-2">
                <div className="w-full max-w-lg px-5 py-4 border-2 rounded-xl shadow-md my-4 bg-white">
                  <div className="grid grid-cols-4 mb-5">
                    <div className="flex justify-center col-span-1">
                      <label htmlFor="upload-button" style={{'backgroundImage': image.preview ? 'url(' + image.preview + ')' : ''}} className="w-20 h-20 flex justify-center items-center cursor-pointer rounded-full bg-center bg-no-repeat bg-cover bg-gray-200">
                        {
                          !image.preview &&
                          <div className="flex flex-col items-center justify-center">
                            <img src="default-user.png" alt="default user"/>
                          </div>
                        }
                      </label>
                      <input className="hidden" type="file" accept=".jpg, .jpeg, .png" id="upload-button" onChange={handleImage}/>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                      <input style={errorName && {borderColor: "#dc2626"}} className="w-full border-2 rounded-md py-2 px-2 focus:outline-teal-700" type="text" value={name} onChange={e => {setName(e.target.value); setErrorName(null)}}/>
                      { errorName !== '' && <p className="text-red-600 text-xs mt-1">{errorName}</p> }
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">Gender</label>
                    <div className="relative">
                      <select onChange={e => setGender(e.target.value)} className="block appearance-none w-full border-2 border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-teal-700 focus:bg-white">
                        <option value="m" >Male</option>
                        <option value="f" onChange={e => setGender(e.target.value)}>Female</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input style={errorEmail && {borderColor: "#dc2626"}} className="w-full border-2 rounded-md py-2 px-2 focus:outline-teal-700" type="email" value={email} onChange={e => {setEmail(e.target.value); setErrorEmail(null)}}/>
                    { errorEmail !== '' && <p className="text-red-600 text-xs mt-1">{errorEmail}</p> }
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input style={errorPassword && {borderColor: "#dc2626"}} className="w-full border-2 rounded-md py-2 px-2 focus:outline-teal-700" type="password" value={password} onChange={e => {setPassword(e.target.value); setErrorPassword(null)}}/>
                    { errorPassword !== '' && <p className="text-red-600 text-xs mt-1">{errorPassword}</p> }
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Role</label>
                    <div className="relative">
                      <select onChange={e => setRole(e.target.value)} className="block appearance-none w-full border-2 border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-teal-700 focus:bg-white">
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-5">
                    <button type="submit" className="border-teal-700 border-2 py-2 px-4 rounded-lg bg-white text-teal-700 hover:bg-teal-700 hover:text-white transition">Register</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
      }
    </div>
  )
}

export default Register
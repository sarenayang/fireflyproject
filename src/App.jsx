import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const CLIENT_ID = "7ae719c349a348cfbf6126bcd6125859"
  const REDIRECT_URI = "http://localhost:5173/"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  return (
    <div className="App">
      <div>
      <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
      </div>
    </div>
  )
}

export default App

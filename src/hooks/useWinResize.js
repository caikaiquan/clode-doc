import { useState, useEffect } from 'react'
const useWinResize = (type) => {
  const [ winWidth, setWinWidth ] = useState(window.innerWidth)
  const [ winHeight, setWinHeight ] = useState(window.innerHeight)
  const handleResize = (e) => {
    setWinWidth(e.target.innerWidth)
    setWinHeight(e.target.innerHeight)
    console.log('e.target.innerHeight',e.target.innerHeight)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })
  return {
    winWidth, 
    winHeight
  }
}

export default useWinResize
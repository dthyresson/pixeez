import { useState, useEffect } from 'react'

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="rounded-full bg-gray-200 p-2 dark:bg-gray-700"
    >
      {isDarkMode ? '🌙' : '☀️'}
    </button>
  )
}

export default DarkModeToggle

import { useState, useEffect } from 'react'

import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
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
      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-pink-600 bg-white text-lg hover:bg-pink-100 dark:bg-pink-900 dark:hover:bg-pink-700"
    >
      {isDarkMode ? (
        <MoonIcon className="h-4 w-4 text-pink-600" />
      ) : (
        <SunIcon className="h-4 w-4 text-pink-600" />
      )}
    </button>
  )
}

export default DarkModeToggle

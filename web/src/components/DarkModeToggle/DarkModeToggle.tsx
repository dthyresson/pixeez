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
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-purple-600 text-lg hover:bg-purple-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
      >
      {isDarkMode ? (
        <MoonIcon className="h-4 w-4 text-purple-600" />
      ) : (
        <SunIcon className="h-4 w-4 text-purple-600" />
      )}
    </button>
  )
}

export default DarkModeToggle

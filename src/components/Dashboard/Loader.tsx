import React from 'react'

const Loader = () => {
  return (
    <div><div className=" container flex flex-col m-8 rounded shadow-md w-full animate-pulse h-96">
    <div className="h-screen rounded-t dark:bg-gray-300"></div>
    <div className="flex-1 px-4 py-8 space-y-4 sm:p-8 dark:bg-gray-50">
    <div className="w-full h-screen rounded dark:bg-gray-300"></div>
    <div className="w-full h-screen rounded dark:bg-gray-300"></div>
    <div className="w-3/4 h-screen rounded dark:bg-gray-300"></div>
    </div>
    </div>
    </div>
  )
}

export default Loader
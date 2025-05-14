import React from 'react'
import Form from './components/Form'

function App() {
  return (

    <divc className ="flex w-full h-screen" >
      <div className='w-full flex flex-col items-center justify-center lg:w-1/2'>
        <Form />
      </div>
      <div className='hidden md:block w-1/2 bg-gray-200 p-10 rounded-lg shadow-lg'>
        <h1 className='text-center text-2xl font-bold '>Welcome to Order Front</h1>
        <p className='text-center text-gray-600'>Your one-stop solution for managing orders efficiently.</p>
        <img  className = "item-center ml-14 pl-9 pt-10 w-3/4 rounded-lg "src="./loginImage.jpg" alt="loginImage" />
      </div>
    </divc>
  )
}

export default App
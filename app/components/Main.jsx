import React from 'react'
import Video from './Video'

const Main = () => {
  return (
    <div className='min-h-screen w-screen bg-black flex justify-center py-10 gap-3'>
      <div className='w-[250px] flex flex-col items-center justify-center'>
        <div className='text-2xl'>Your Score</div>
        <div className='text-2xl'>0</div>
      </div>
      <div className='flex flex-col items-center justify-center px-4 gap-4'>
        <div className='text-3xl'>PLAY ROCK PAPERS SCISSORS !!!</div>
        <Video/>
      </div>
      <div className='w-[250px] flex flex-col items-center justify-center'>
        <div className='text-2xl'>Computer Score</div>
        <div className='text-2xl'>0</div>
      </div>
    </div>
  )
}

export default Main

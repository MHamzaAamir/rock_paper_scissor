import React from 'react'
import Image from 'next/image'

const Instructions = () => {
    return (
        <div className='min-h-screen flex flex-col justify-center items-center gap-10 bg-black'>
            <div className='text-3xl'>PLAY ROCK PAPER SCISSORS !!!</div>
            <div className='flex flex-col gap-2 justify-center items-center'>
                <div className='text-xl'>Instructions</div>
                <div>Press the Next Round button and show your hand in the camera</div>
                <div>Try to beat the Computer. Good Luck !!</div>
                <div className='flex gap-2'>
                    <div>
                        <Image src={"/rock.jpg"} width={100} height={100} alt='rock'/>
                        <div className='text-center'>Rock</div>
                    </div>
                    <div>
                        <Image src={"/paper.jpg"} width={100} height={100} alt='paper'/>
                        <div className='text-center'>Paper</div>
                    </div>
                    <div>
                        <Image src={"/scissor.jpg"} width={100} height={100} alt='scissor'/>
                        <div className='text-center'>Scissor</div>
                    </div>
                </div>
                <div>Scroll Down !!</div>
            </div>
        </div>
    )
}

export default Instructions

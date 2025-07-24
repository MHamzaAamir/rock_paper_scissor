'use client';
import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as ort from 'onnxruntime-web';
import Instructions from './Instructions';

export function Video() {
  const class_name = ["rock", "paper", "scissor"]
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const countdownRef = useRef(null)
  const choiceRef = useRef(null)
  const wonRef = useRef(null)
  const [handLandmarker, setHandLandmarker] = useState(null)
  const [session, setSession] = useState(null)
  const [userPoints, setUserPoints] = useState(0)
  const [computerPoints, setComputerPoints] = useState(0)
  const [isDisabled, setDisabled] = useState(false)

  useEffect(() => {
    const loadModels = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
      );
      const handLandmarkerTemp = await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'IMAGE',
          numHands: 1,
          minHandDetectionConfidence: 0.3,
          minHandPresenceConfidence: 0.3
        }
      );
      setHandLandmarker(handLandmarkerTemp)

      const session = await ort.InferenceSession.create('./rps.onnx');
      setSession(session)

      choiceRef.current.textContent = "Ready ..."

    };

    loadModels()

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  const handleNoHand = () => {
    choiceRef.current.textContent = "No Hand Detected"
    wonRef.current.textContent = ""
  }

  const processResults = (results) => {
    let processed = []

    if (results.landmarks.length == 0) {
      return processed
    }

    let x = results.landmarks[0][0].x
    let y = results.landmarks[0][0].y

    results.landmarks[0].forEach((coordinates) => {
      processed.push(coordinates.x - x)
      processed.push(coordinates.y - y)
    })

    return processed
  }

  const updatePoints = (userChoice) => {
    const computerChoice = class_name[Math.floor(Math.random() * 3)];
    let result = ""

    if (computerChoice == userChoice) {
      result = "tie"
    } else {
      if (computerChoice == "rock" && userChoice == "paper") {
        result = "user"
      } else if (computerChoice == "rock" && userChoice == "scissor") {
        result = "computer"
      } else if (computerChoice == "paper" && userChoice == "scissor") {
        result = "user"
      } else if (computerChoice == "paper" && userChoice == "rock") {
        result = "computer"
      } else if (computerChoice == "scissor" && userChoice == "rock") {
        result = "user"
      } else if (computerChoice == "scissor" && userChoice == "paper") {
        result = "computer"
      }
    }

    if (result == "tie") {
      choiceRef.current.textContent = `Computer Choice: ${computerChoice} | Your Choice: ${userChoice}`
      wonRef.current.textContent = "It's a Tie"
      wonRef.current.style.color = "#e6e605"
    } else if (result == "computer") {
      choiceRef.current.textContent = `Computer Choice: ${computerChoice} | Your Choice: ${userChoice}`
      wonRef.current.textContent = "Computer Won"
      wonRef.current.style.color = "#da0303"
      setComputerPoints(computerPoints + 1)
    } else if (result == "user") {
      choiceRef.current.textContent = `Computer Choice: ${computerChoice} | Your Choice: ${userChoice}`
      wonRef.current.textContent = "You won"
      wonRef.current.style.color = "#26cf08"
      setUserPoints(userPoints + 1)
    }
  }

  const makePrediction = async (processedResults) => {
    const inputTensor = new ort.Tensor('float32', Float32Array.from(processedResults), [1, processedResults.length]);
    const feeds = {};
    feeds[session.inputNames[0]] = inputTensor;
    const results = await session.run(feeds)
    const outputData = results[session.outputNames[0]].data;
    const predictedIndex = outputData.indexOf(Math.max(...outputData));
    let userChoice = class_name[predictedIndex]
    updatePoints(userChoice)
  }

  const startTimer = () => {
    setDisabled(true)
    let seconds = 3;
    countdownRef.current.textContent = `Countdown: ${seconds}`;
    choiceRef.current.textContent = ""
    wonRef.current.textContent = ""

    const interval = setInterval(() => {
      seconds--;
      countdownRef.current.textContent = `Countdown: ${seconds}`;

      if (seconds <= 0) {
        clearInterval(interval);
        setDisabled(false)
        predictOneFrame()
      }
    }, 1000);
  }

  const predictOneFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const offscreen = document.createElement('canvas');
    offscreen.width = video.videoWidth;
    offscreen.height = video.videoHeight;
    const offCtx = offscreen.getContext('2d');
    offCtx.drawImage(video, 0, 0, offscreen.width, offscreen.height);

    const results = handLandmarker.detect(offscreen);
    let processedResults = processResults(results)
    if (processedResults.length == 0) {
      handleNoHand()
    } else {
      makePrediction(processedResults)
    }
  }

  const reset = () => {
    setComputerPoints(0)
    setUserPoints(0)
    wonRef.current.textContent = ""
    choiceRef.current.textContent = ""
  }

  return (
    <>
      <Instructions />
      <div className='min-h-screen w-screen bg-black flex justify-center py-10 gap-3'>
        <div className='w-[250px] flex flex-col items-center justify-center text-[#26cf08]'>
          <div className='text-2xl'>Your Score</div>
          <div className='text-2xl'>{userPoints}</div>
        </div>

        <div className='relative max-w-[500px] flex flex-col items-center justify-center gap-3'>
          <video ref={videoRef} autoPlay playsInline />
          <canvas ref={canvasRef} className='hidden' />
          <div className='flex justify-center items-center gap-2'>
            <button className='cursor-pointer rounded-2xl p-2 bg-gray-800' disabled={isDisabled} onClick={startTimer}>
              Play Round
            </button>
            <button className='cursor-pointer rounded-2xl p-2 bg-gray-800' disabled={isDisabled} onClick={reset}>
              Reset
            </button>
          </div>
          <div className='h-[75px] w-full text-center'>
            <div ref={countdownRef}>Countdown: 0</div>
            <div ref={choiceRef}>Loading Model ...</div>
            <div ref={wonRef}></div>
          </div>
        </div>

        <div className='w-[250px] flex flex-col items-center justify-center text-[#da0303]'>
          <div className='text-2xl'>Computer Score</div>
          <div className='text-2xl'>{computerPoints}</div>
        </div>
      </div>


    </>
  );
}

export default Video



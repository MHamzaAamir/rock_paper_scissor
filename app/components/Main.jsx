'use client';
import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as ort from 'onnxruntime-web';

export function Video() {
  const class_name = ["rock", "paper", "scissor"]
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [handLandmarker, setHandLandmarker] = useState(null)
  const [session, setSession] = useState(null)

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
          minHandDetectionConfidence: 0.3
        }
      );
      setHandLandmarker(handLandmarkerTemp)

      const session = await ort.InferenceSession.create('./rps.onnx');
      setSession(session)

    };

    loadModels()

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  }, []);

  const handleNoHand = () => {
    console.log("Cant See Your Hand")
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

  const makePrediction = async (processedResults) => {
    console.log(processedResults)
    const inputTensor = new ort.Tensor('float32', Float32Array.from(processedResults), [1, processedResults.length]);
    const feeds = {};
    feeds[session.inputNames[0]] = inputTensor;
    const results = await session.run(feeds)
    const outputData = results[session.outputNames[0]].data;
    const predictedIndex = outputData.indexOf(Math.max(...outputData));
    console.log(class_name[predictedIndex])
  }

  const predictOneFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!handLandmarker || !video) {
      console.log('Model or video not ready');
      return;
    }

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

  return (
    <div className='min-h-screen w-screen bg-black flex justify-center py-10 gap-3'>
      <div className='w-[250px] flex flex-col items-center justify-center'>
        <div className='text-2xl'>Your Score</div>
        <div className='text-2xl'>0</div>
      </div>
      <div className='flex flex-col items-center justify-center px-4 gap-4'>
        <div className='text-3xl'>PLAY ROCK PAPER SCISSORS !!!</div>
        <div className='flex flex-col max-w-[500px]'>
          <video ref={videoRef} autoPlay playsInline />
          <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
          <button onClick={predictOneFrame}>
            Make Prediction
          </button>
        </div>
      </div>
      <div className='w-[250px] flex flex-col items-center justify-center'>
        <div className='text-2xl'>Computer Score</div>
        <div className='text-2xl'>0</div>
      </div>
    </div>
  );
}

export default Video



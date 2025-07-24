# Rock Paper Scissor - Computer Vision Edition

Play Rock Paper Scissor against the Computer using your webcam!  
Live demo: [rock-paper-scissor-cv.vercel.app](https://rock-paper-scissor-cv.vercel.app)

## About

This repository implements the classic Rock Paper Scissor game with a computer vision twist. Instead of clicking buttons, you show your choice to the webcam using hand gestures. The app leverages **MediaPipe's hand model** for real-time hand landmark detection, then classifies your gesture using a simple neural network trained with TensorFlow and deployed in-browser using ONNX Web Runtime.

## How It Works

- **Hand Detection:** Uses MediaPipe to identify and track hand landmarks from the webcam feed.
- **Gesture Classification:** A neural network (built in TensorFlow) receives the hand landmarks and predicts your gesture: Rock, Paper, or Scissor.
- **Web Deployment:** The model is converted to ONNX format and runs entirely in your browser through ONNX Web Runtime for fast, client-side inference.

## Setup Instructions

To run locally or contribute:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MHamzaAamir/rock_paper_scissor_cv.git
   cd rock_paper_scissor
   ```

2. **Install dependencies:**
   - Make sure you have [Node.js](https://nodejs.org/) installed.
   - Then run:
     ```bash
     npm install
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app should be available at `http://localhost:3000`.

4. **Play the Game:**
   - Allow webcam access when prompted.
   - Show your hand gesture (rock, paper, or scissors) to play against the Computer.

## Technologies Used

- [MediaPipe](https://mediapipe.dev/) for hand landmark detection
- [TensorFlow](https://www.tensorflow.org/) for gesture classification neural network
- [ONNX Web Runtime](https://onnxruntime.ai/) for in-browser model inference
- [Vercel](https://vercel.com/) for deployment

## Live Demo

Try it now: [rock-paper-scissor-cv.vercel.app](https://rock-paper-scissor-cv.vercel.app)

## License

This project is open source and available under the MIT License.

---

Enjoy playing Rock Paper Scissors !
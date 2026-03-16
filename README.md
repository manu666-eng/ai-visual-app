# AI Visual Navigation Assistant

An AI-powered mobile application designed to help visually impaired individuals navigate their surroundings safely using computer vision and artificial intelligence.

---

## Problem Statement

Visually impaired individuals face difficulties navigating unfamiliar environments because they cannot detect obstacles in real time.

Traditional navigation tools such as GPS provide location guidance but cannot detect nearby objects such as chairs, walls, or people.

This project provides real-time environmental awareness using artificial intelligence.

---

## Solution

The AI Visual Navigation Assistant uses a smartphone camera and cloud-based AI services to detect objects in the environment.

The system analyzes captured images using **AWS Rekognition** and generates navigation instructions using **AI reasoning models**.

---

## Features

- Real-time object detection
- AI-powered navigation instructions
- Mobile-based accessibility solution
- Cloud-based backend architecture
- Computer vision for environmental awareness

---

## Technology Stack

### Frontend
- React Native
- Expo

### Backend
- Node.js
- Express.js

### AI Services
- AWS Rekognition
- Amazon Nova AI

### Deployment
- Vercel

---

## System Architecture

User  
↓  
Mobile App (React Native)  
↓  
Camera Capture  
↓  
Backend API (Node.js)  
↓  
AWS Rekognition  
↓  
AI Reasoning Model  
↓  
Navigation Instructions

---

## Installation

### Backend
npm install
node server.js


### Frontend
npm install
npx expo start


---

## API Endpoint

Example endpoint:
POST /analyze-image


Example request:


{
"image": "base64-image-data"
}


---

## Demo

Backend deployed on Vercel:

https://ai-visual-assistant-backend.vercel.app

---

## Future Improvements

- Real-time video detection
- Voice navigation guidance
- Offline AI models
- Smart glasses integration

---
## Application Screenshots

### AI Navigation Starting
![AI Start](app-start.png)

### Object Detection Result
![Detection Result](person-detection.png)

## Author

Manoj Mamidi  
B.Tech CSD

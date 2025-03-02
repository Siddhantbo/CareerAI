import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import toast from "react-hot-toast";
import useSpeechToText from "react-hook-speech-to-text";
import axios from "axios";

const TalkWithAi = () => {
  const modelRef = useRef(null);
  const mouthRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const headRef = useRef(null);
  let headAnimationFrameId = null;
  let mouthAnimationFrameId = null;
  let eyesAnimationFrameId = null;
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const loadHumanModel = () => {
    const loader = new GLTFLoader();
    loader.load(
      "https://models.readyplayer.me/679012f122bc116843b4a305.glb",
      // https://models.readyplayer.me/679012f122bc116843b4a305.glb?quality=high&useHands=false
      (gltf) => {
        modelRef.current.add(gltf.scene);

        gltf.scene.traverse((child) => {
          // console.log(child.name);

          if (child.isMesh) {
            if (
              child.name.toLowerCase().includes("mouth") ||
              child.name.toLowerCase().includes("head")
            ) {
              mouthRef.current = child;
            }
            if (child.name.includes("EyeLeft")) {
              leftEyeRef.current = child;
            }
            if (child.name.includes("EyeRight")) {
              rightEyeRef.current = child;
            }
            if (child.name === "Wolf3D_Head") {
              headRef.current = child;
            }
          }
        });

        if (!mouthRef.current) {
          toast.error("Mouth mesh not found in the model.");
        }
        if (!leftEyeRef.current || !rightEyeRef.current) {
          toast.error("Eye meshes not found in the model.");
        } else {
          startBlinking();
        }
        if (!headRef.current) {
          toast.error("Head mesh not found.");
        } else {
          startHeadMovement();
        }
      },
      undefined,
      (error) => {
        toast.error("Error loading model:", error);
      }
    );
  };

  useEffect(() => {
    loadHumanModel();
    return () => {
      cancelAnimationFrame(mouthAnimationFrameId);
      cancelAnimationFrame(eyesAnimationFrameId);
      cancelAnimationFrame(headAnimationFrameId);
    };
  }, []);

  const speakAiAnswer = (answer) => {
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.voice = speechSynthesis.getVoices()[0];

    utterance.onstart = () => {
      animateLips(); // Start lip animation when speech begins
    };

    utterance.onend = () => {
      stopLipAnimation(); // Stop lip animation when speech ends
    };

    window.speechSynthesis.speak(utterance);
  };

  const animateLips = () => {
    if (!mouthRef.current || !mouthRef.current.morphTargetInfluences) {
      toast.error("Mouth mesh or morphTargetInfluences not found.");
      return;
    }

    let targetValue = 0;
    let currentValue = 0;
    const speed = 0.3;

    const animate = () => {
      if (Math.abs(targetValue - currentValue) > 0.01) {
        currentValue += (targetValue - currentValue) * speed;
      } else {
        targetValue = Math.random();
      }

      mouthRef.current.morphTargetInfluences[0] = currentValue;

      mouthAnimationFrameId = requestAnimationFrame(animate);
    };

    animate();
  };

  const stopLipAnimation = () => {
    if (mouthRef.current && mouthRef.current.morphTargetInfluences) {
      mouthRef.current.morphTargetInfluences[0] = 0;
    }
    cancelAnimationFrame(mouthAnimationFrameId);
  };

  const startBlinking = () => {
    const blink = () => {
      if (leftEyeRef.current && rightEyeRef.current) {
        leftEyeRef.current.visible = false;
        rightEyeRef.current.visible = false;

        setTimeout(() => {
          leftEyeRef.current.visible = true;
          rightEyeRef.current.visible = true;
        }, 150);
      }
      eyesAnimationFrameId = setTimeout(blink, Math.random() * 2000 + 2000);
    };

    blink();
  };

  const startHeadMovement = () => {
    let headBone = null;

    // Find the Head bone in the model
    modelRef.current.traverse((object) => {
      if (object.isBone && object.name === "Head") {
        headBone = object;
      }
    });

    if (!headBone) {
      toast.error("Head bone not found in the model.");
      return;
    }

    let currentRotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    let speed = 0.02;

    const generateRandomTarget = () => {
      // Generate a new random target rotation for the head
      targetRotation.x = (Math.random() - 0.5) * 0.2; // Random x-axis rotation
      targetRotation.y = (Math.random() - 0.5) * 0.4; // Random y-axis rotation
      speed = Math.random() * 0.02 + 0.01; // Random speed
    };

    const animate = () => {
      // Smoothly interpolate the current rotation toward the target rotation
      currentRotation.x += (targetRotation.x - currentRotation.x) * speed;
      currentRotation.y += (targetRotation.y - currentRotation.y) * speed;

      // Apply the current rotation to the head bone
      headBone.rotation.x = currentRotation.x;
      headBone.rotation.y = currentRotation.y;

      // If the current rotation is close enough to the target, generate a new target
      if (
        Math.abs(currentRotation.x - targetRotation.x) < 0.01 &&
        Math.abs(currentRotation.y - targetRotation.y) < 0.01
      ) {
        generateRandomTarget();
      }

      requestAnimationFrame(animate);
    };

    generateRandomTarget(); // Set the initial random target
    animate();
  };

  useEffect(() => {
    if (!isRecording) {
      handleStopListening();
    }
  }, [isRecording]);

  const handleStopListening = async () => {
    stopSpeechToText();
    const inputPrompt = results.map((result) => result.transcript).join(" ");
    console.log("Input Prompt:", inputPrompt);

    setResults([]);
    if (inputPrompt === "") {
      toast.error("No input detected.");
      return;
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          contents: [
            {
              parts: [
                {
                  text: inputPrompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const aiResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";
      speakAiAnswer(aiResponse);
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error("Failed to generate AI response.");
    }
  };

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 3D Model Section */}
      <div
        className="relative h-[500px] overflow-hidden custom-canvas"
        style={{
          backgroundImage: "url('/assets/ai-background-5.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Canvas
          style={{ width: "100%", height: "100%" }}
          camera={{
            position: [0, 1.5, 0],
            fov: 30,
          }}
        >
          {/* Lighting */}
          <ambientLight intensity={2.3} />
          <pointLight position={[5, 5, 5]} />
          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 1.8}
          />
          {/* 3D Model */}
          <group ref={modelRef} position={[0, -1.6, 0]}></group>
        </Canvas>
      </div>

      {/* Button Section */}
      <div className="flex justify-center items-center bg-gray-100 p-4">
        <button
          onClick={StartStopRecording}
          className="bg-[#0d9488] text-white font-bold py-2 px-4 rounded"
        >
          {isRecording ? "Stop Listening" : "Start Listening"}
        </button>
      </div>
    </div>
  );
};

export default TalkWithAi;

///////////////////////// praefect but not working properly //////////////////////////////////////////

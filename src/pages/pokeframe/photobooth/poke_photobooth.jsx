import { useEffect, useRef, useState } from "react";

import "./poke_photobooth.css";

const COUNTDOWN_SECONDS = 3;

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h3l1.4-2h7.2L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6v6h-6" />
      <path d="M4 18v-6h6" />
      <path d="M19 9a8 8 0 0 0-13-3L4 8" />
      <path d="M5 15a8 8 0 0 0 13 3l2-2" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H3v5" />
      <path d="m3 3 6 6" />
      <path d="M16 3h5v5" />
      <path d="m21 3-6 6" />
      <path d="M8 21H3v-5" />
      <path d="m3 21 6-6" />
      <path d="M16 21h5v-5" />
      <path d="m21 21-6-6" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 8-5-5" />
      <path d="M8 3v5H3" />
      <path d="m16 8 5-5" />
      <path d="M16 3v5h5" />
      <path d="m8 16-5 5" />
      <path d="M8 21v-5H3" />
      <path d="m16 16 5 5" />
      <path d="M16 21v-5h5" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 1.25 3.75L17 8l-3.75 1.25L12 13l-1.25-3.75L7 8l3.75-1.25L12 3Z" />
      <path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
    </svg>
  );
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export default function PokePhotobooth({
  cameraId = "",
  mirrored = true,
  onBack,
  onContinue,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cameraScreenRef = useRef(null);
  const audioContextRef = useRef(null);
  const captureTokenRef = useRef(0);

  const [cameraError, setCameraError] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [flash, setFlash] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const getVideoConstraints = () => {
    if (cameraId) {
      return {
        deviceId: {
          exact: cameraId,
        },
        width: {
          ideal: 1920,
        },
        height: {
          ideal: 1080,
        },
      };
    }

    return {
      width: {
        ideal: 1920,
      },
      height: {
        ideal: 1080,
      },
      facingMode: {
        ideal: "user",
      },
    };
  };

  const startCamera = async () => {
    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: getVideoConstraints(),
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play().catch(() => {});
      }

      setCameraError("");
    } catch {
      setCameraError(
        "Camera access is unavailable. Check your browser permission."
      );
    }
  };

  const getAudioContext = async () => {
    if (!audioContextRef.current) {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      audioContextRef.current = new AudioContext();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  };

  const playTone = async (frequency, duration, volume = 0.12) => {
    const context = await getAudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  };

  const playCountdownSound = async (number) => {
    await playTone(number === 1 ? 980 : 700, 0.1);
  };

  const playShutterSound = async () => {
    const context = await getAudioContext();
    const bufferSize = Math.floor(context.sampleRate * 0.1);
    const buffer = context.createBuffer(
      1,
      bufferSize,
      context.sampleRate
    );
    const data = buffer.getChannelData(0);

    for (let index = 0; index < bufferSize; index += 1) {
      const fade = 1 - index / bufferSize;

      data[index] = (Math.random() * 2 - 1) * fade;
    }

    const source = context.createBufferSource();
    const gain = context.createGain();

    source.buffer = buffer;
    gain.gain.value = 0.2;

    source.connect(gain);
    gain.connect(context.destination);

    source.start();
  };

  const capturePhoto = () => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      return "";
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (!context) {
      return "";
    }

    context.save();

    if (mirrored) {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.restore();

    return canvas.toDataURL("image/jpeg", 0.95);
  };

  const handleTakePhoto = async () => {
    if (
      isCapturing ||
      cameraError ||
      !videoRef.current?.videoWidth
    ) {
      return;
    }

    await getAudioContext();

    const token = captureTokenRef.current + 1;

    captureTokenRef.current = token;

    setCapturedPhoto("");
    setIsCapturing(true);

    for (
      let number = COUNTDOWN_SECONDS;
      number >= 1;
      number -= 1
    ) {
      if (captureTokenRef.current !== token) {
        return;
      }

      setCountdown(number);
      await playCountdownSound(number);
      await delay(1000);
    }

    if (captureTokenRef.current !== token) {
      return;
    }

    setCountdown(null);
    setFlash(true);

    const photo = capturePhoto();

    playShutterSound();

    if (photo) {
      setCapturedPhoto(photo);
    }

    await delay(150);

    setFlash(false);
    setIsCapturing(false);
  };

  const handleRetake = () => {
    if (isCapturing) {
      return;
    }

    captureTokenRef.current += 1;

    setCountdown(null);
    setFlash(false);
    setCapturedPhoto("");
  };

  const handleContinue = () => {
    if (!capturedPhoto) {
      return;
    }

    captureTokenRef.current += 1;

    setCountdown(null);
    setIsCapturing(false);

    stopCamera();

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    onContinue?.(capturedPhoto);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await cameraScreenRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen(false);
    }
  };

  const handleBack = () => {
    captureTokenRef.current += 1;

    setCountdown(null);
    setIsCapturing(false);

    stopCamera();

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    onBack?.();
  };

  useEffect(() => {
    let mounted = true;

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: getVideoConstraints(),
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });

          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }

        setCameraError("");
      } catch {
        if (mounted) {
          setCameraError(
            "Camera access is unavailable. Check your browser permission."
          );
        }
      }
    };

    initializeCamera();

    return () => {
      mounted = false;
      captureTokenRef.current += 1;

      stopCamera();

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [cameraId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div className="poke-photobooth-page">
      <main className="poke-photobooth-container">
        <header className="poke-photobooth-header">
          <button
            type="button"
            className="poke-photobooth-back"
            onClick={handleBack}
          >
            <ArrowLeftIcon />
            <span>Back</span>
          </button>

          <div className="poke-photobooth-title">
            <span>PokeFrame</span>
            <strong>Take your photo</strong>
          </div>

          <div className="poke-photobooth-step">
            <SparklesIcon />
            <span>1 photo</span>
          </div>
        </header>

        <section className="poke-photobooth-content">
          <div
            ref={cameraScreenRef}
            className="poke-camera-screen"
          >
            {!cameraError && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`poke-camera-video ${
                  mirrored ? "poke-camera-mirrored" : ""
                }`}
              />
            )}

            {cameraError && (
              <div className="poke-camera-error">
                <div className="poke-camera-error-icon">
                  <CameraIcon />
                </div>

                <strong>Camera access needed</strong>

                <p>{cameraError}</p>

                <button
                  type="button"
                  onClick={startCamera}
                >
                  Try Again
                </button>
              </div>
            )}

            <div
              className={`poke-photo-preview ${
                capturedPhoto
                  ? "poke-photo-preview-filled"
                  : ""
              }`}
            >
              <div className="poke-photo-preview-header">
                <span>Preview</span>

                {capturedPhoto && (
                  <span className="poke-preview-ready">
                    Ready
                  </span>
                )}
              </div>

              <div className="poke-photo-preview-image">
                {capturedPhoto ? (
                  <img
                    src={capturedPhoto}
                    alt="PokeFrame preview"
                  />
                ) : (
                  <div className="poke-photo-preview-empty">
                    <CameraIcon />
                    <span>Your photo</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="poke-fullscreen-button"
              onClick={toggleFullscreen}
              aria-label={
                isFullscreen
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
            >
              {isFullscreen ? (
                <MinimizeIcon />
              ) : (
                <MaximizeIcon />
              )}

              <span>
                {isFullscreen
                  ? "Minimize"
                  : "Fullscreen"}
              </span>
            </button>

            {!cameraError && countdown && (
              <div className="poke-countdown">
                <span>{countdown}</span>
                <small>
                  {countdown === 1
                    ? "Smile!"
                    : "Get ready"}
                </small>
              </div>
            )}

            {flash && (
              <div className="poke-camera-flash" />
            )}

            {!cameraError && !capturedPhoto && (
              <div className="poke-camera-actions">
                <button
                  type="button"
                  className="poke-capture-button"
                  onClick={handleTakePhoto}
                  disabled={isCapturing}
                >
                  <span className="poke-capture-icon">
                    <CameraIcon />
                  </span>

                  <span>
                    {isCapturing
                      ? "Taking photo..."
                      : "Take Photo"}
                  </span>
                </button>
              </div>
            )}

            {!cameraError && capturedPhoto && (
              <div className="poke-camera-actions poke-camera-actions-result">
                <button
                  type="button"
                  className="poke-retake-button"
                  onClick={handleRetake}
                >
                  <RefreshIcon />
                  Retake
                </button>

                <button
                  type="button"
                  className="poke-continue-button"
                  onClick={handleContinue}
                >
                  Continue
                  <span>→</span>
                </button>
              </div>
            )}

            <div className="poke-camera-tip">
              <span>✦</span>
              Keep your face inside the camera and leave a little space around you.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

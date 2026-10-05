import { useEffect, useRef, useState } from "react";

import "./poke_photobooth.css";
import "../../solo/photobooth/solo_photobooth.css";

const COUNTDOWN_SECONDS = 5;

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

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h3l1.4-2h7.2L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
      <circle cx="12" cy="13" r="4" />
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
  const sessionTokenRef = useRef(0);

  const [cameraError, setCameraError] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState("");
  const [isShooting, setIsShooting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flash, setFlash] = useState(false);

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

  const playTone = async (
    frequency,
    duration,
    volume = 0.13
  ) => {
    const context = await getAudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
      volume,
      context.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(
      context.currentTime + duration
    );
  };

  const playCountdownSound = async (number) => {
    const frequency =
      number === 1 ? 1000 : 720;

    await playTone(
      frequency,
      0.1,
      0.12
    );
  };

  const playShutterSound = async () => {
    const context = await getAudioContext();
    const bufferSize = Math.floor(
      context.sampleRate * 0.12
    );

    const buffer = context.createBuffer(
      1,
      bufferSize,
      context.sampleRate
    );

    const data = buffer.getChannelData(0);

    for (
      let index = 0;
      index < bufferSize;
      index += 1
    ) {
      const fade =
        1 - index / bufferSize;

      data[index] =
        (Math.random() * 2 - 1) *
        fade;
    }

    const source =
      context.createBufferSource();

    const gain =
      context.createGain();

    source.buffer = buffer;
    gain.gain.value = 0.22;

    source.connect(gain);
    gain.connect(context.destination);

    source.start();

    await playTone(
      150,
      0.07,
      0.09
    );
  };

  const capturePhoto = () => {
    const video = videoRef.current;

    if (
      !video ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      return "";
    }

    const canvas =
      document.createElement("canvas");

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return "";
    }

    context.save();

    if (mirrored) {
      context.translate(
        canvas.width,
        0
      );

      context.scale(
        -1,
        1
      );
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.restore();

    return canvas.toDataURL(
      "image/jpeg",
      0.94
    );
  };

  const takePhoto = async () => {
    if (
      isShooting ||
      cameraError
    ) {
      return;
    }

    if (
      !videoRef.current ||
      !videoRef.current.videoWidth
    ) {
      return;
    }

    await getAudioContext();

    const token =
      sessionTokenRef.current + 1;

    sessionTokenRef.current =
      token;

    setCapturedPhoto("");
    setCountdown(null);
    setIsShooting(true);

    for (
      let number = COUNTDOWN_SECONDS;
      number >= 1;
      number -= 1
    ) {
      if (
        sessionTokenRef.current !== token
      ) {
        return;
      }

      setCountdown(number);

      await playCountdownSound(
        number
      );

      await delay(1000);
    }

    if (
      sessionTokenRef.current !== token
    ) {
      return;
    }

    setCountdown(null);
    setFlash(true);

    const photo =
      capturePhoto();

    playShutterSound();

    if (photo) {
      setCapturedPhoto(photo);
    }

    await delay(160);

    setFlash(false);

    if (
      sessionTokenRef.current === token
    ) {
      setIsShooting(false);
    }
  };

  const handleRetake = () => {
    if (isShooting) {
      return;
    }

    sessionTokenRef.current += 1;

    setCountdown(null);
    setFlash(false);
    setCapturedPhoto("");
  };

  const handleContinue = () => {
    if (!capturedPhoto) {
      return;
    }

    sessionTokenRef.current += 1;

    setIsShooting(false);
    setCountdown(null);

    stopCamera();

    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .catch(() => {});
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
    sessionTokenRef.current += 1;

    setCountdown(null);
    setIsShooting(false);

    stopCamera();

    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .catch(() => {});
    }

    onBack?.();
  };

  useEffect(() => {
    let mounted = true;

    const initializeCamera = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video:
              getVideoConstraints(),
            audio: false,
          });

        if (!mounted) {
          stream
            .getTracks()
            .forEach((track) => {
              track.stop();
            });

          return;
        }

        streamRef.current =
          stream;

        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;

          videoRef.current
            .play()
            .catch(() => {});
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

      sessionTokenRef.current += 1;

      stopCamera();

      if (audioContextRef.current) {
        audioContextRef.current
          .close()
          .catch(() => {});
      }
    };
  }, [cameraId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(
          document.fullscreenElement
        )
      );
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

  const finished =
    Boolean(capturedPhoto) &&
    !isShooting;

  return (
    <div className="solo-photobooth-page">
      <main className="solo-photobooth-container">
        <header className="solo-photobooth-header">
          <button
            type="button"
            className="photobooth-back-button"
            onClick={handleBack}
          >
            <ArrowLeftIcon />
            <span>Back</span>
          </button>

          <div className="photobooth-current-step">
            <span>PokeFrame</span>
            <strong>Photobooth</strong>
          </div>

          <div className="photobooth-shot-count">
            <strong>
              {capturedPhoto ? "1/1" : "0/1"}
            </strong>
          </div>
        </header>

        <section className="solo-photobooth-content">
          <div
            ref={cameraScreenRef}
            className="photobooth-camera-screen"
          >
            {!cameraError && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`photobooth-camera-video ${
                  mirrored
                    ? "photobooth-camera-mirrored"
                    : ""
                }`}
              />
            )}

            {cameraError && (
              <div className="photobooth-camera-error">
                <div className="photobooth-error-icon">
                  <CameraIcon />
                </div>

                <strong>
                  Camera access needed
                </strong>

                <p>
                  {cameraError}
                </p>

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

            {!cameraError &&
              countdown && (
                <div className="photobooth-countdown">
                  <span>
                    {countdown}
                  </span>

                  <small>
                    {countdown === 1
                      ? "Smile!"
                      : "Get ready"}
                  </small>
                </div>
              )}

            {flash && (
              <div className="photobooth-flash" />
            )}

            <button
              type="button"
              className="photobooth-fullscreen-button"
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

            {!cameraError &&
              !isShooting &&
              !capturedPhoto && (
                <button
                  type="button"
                  className="photobooth-start-button"
                  onClick={takePhoto}
                >
                  Take Photo
                </button>
              )}

            {finished && (
              <div className="photobooth-finished-overlay">
                <div className="photobooth-result-actions">
                  <button
                    type="button"
                    className="photobooth-again-button"
                    onClick={handleRetake}
                  >
                    <RefreshIcon />
                    Retake
                  </button>

                  <button
                    type="button"
                    className="photobooth-download-button"
                    onClick={handleContinue}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

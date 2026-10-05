import { useEffect, useRef, useState } from "react";
import "./poke_photobooth.css";

const COUNTDOWN_SECONDS = 5;
const INTRO_DIALOGUE_FIRST = "A wild memory appeared!";
const INTRO_DIALOGUE_SECOND = "Press CAPTURE when you're ready.";
const INTRO_DIALOGUE = `${INTRO_DIALOGUE_FIRST}\n${INTRO_DIALOGUE_SECOND}`;
const RESULT_DIALOGUE_FIRST = "Gotcha! Your memory was caught.";
const RESULT_DIALOGUE_SECOND = "Keep it or try again?";
const RESULT_DIALOGUE = `${RESULT_DIALOGUE_FIRST}\n${RESULT_DIALOGUE_SECOND}`;
const DIALOGUE_TYPE_SPEED = 34;
const DIALOGUE_START_DELAY = 280;
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

function PixelBallIcon() {
  return (
    <span className="poke-pixel-ball" aria-hidden="true">
      <span className="poke-pixel-ball-center" />
    </span>
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
  const dialogueTimerRef = useRef(null);
  const resultDialogueTimerRef = useRef(null);
  const [cameraError, setCameraError] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState("");
  const [isShooting, setIsShooting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flash, setFlash] = useState(false);
  const [typedIntroDialogue, setTypedIntroDialogue] = useState("");
  const [typedResultDialogue, setTypedResultDialogue] = useState("");
  const [dialogueCycle, setDialogueCycle] = useState(0);
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
        await videoRef.current.play().catch(() => { });
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
    oscillator.type = "square";
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

  const playDialogueTypingSound = (character, index) => {
    if (
      !character ||
      character === " " ||
      character === "\n"
    ) {
      return;
    }

    const frequency =
      760 + (index % 4) * 45;

    playTone(
      frequency,
      0.035,
      0.075
    ).catch(() => { });
  };

  useEffect(() => {
    if (
      cameraError ||
      isShooting ||
      capturedPhoto
    ) {
      return undefined;
    }

    const prefersReducedMotion =
      window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      )?.matches;

    if (prefersReducedMotion) {
      setTypedIntroDialogue(INTRO_DIALOGUE);
      return undefined;
    }

    let characterIndex = 0;
    let cancelled = false;

    setTypedIntroDialogue("");

    const typeNextCharacter = () => {
      if (cancelled) {
        return;
      }

      const character =
        INTRO_DIALOGUE[characterIndex];

      if (character === undefined) {
        return;
      }

      characterIndex += 1;

      setTypedIntroDialogue(
        INTRO_DIALOGUE.slice(
          0,
          characterIndex
        )
      );

      playDialogueTypingSound(
        character,
        characterIndex
      );

      if (
        characterIndex <
        INTRO_DIALOGUE.length
      ) {
        const extraPause =
          character === "!" ||
            character === "."
            ? 150
            : character === "\n"
              ? 180
              : 0;

        dialogueTimerRef.current =
          window.setTimeout(
            typeNextCharacter,
            DIALOGUE_TYPE_SPEED +
            extraPause
          );
      }
    };

    dialogueTimerRef.current =
      window.setTimeout(
        typeNextCharacter,
        DIALOGUE_START_DELAY
      );

    return () => {
      cancelled = true;

      if (dialogueTimerRef.current) {
        window.clearTimeout(
          dialogueTimerRef.current
        );
        dialogueTimerRef.current = null;
      }
    };
  }, [
    cameraError,
    capturedPhoto,
    dialogueCycle,
    isShooting,
  ]);

  useEffect(() => {
    if (
      cameraError ||
      isShooting ||
      !capturedPhoto
    ) {
      setTypedResultDialogue("");
      return undefined;
    }

    const prefersReducedMotion =
      window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      )?.matches;

    if (prefersReducedMotion) {
      setTypedResultDialogue(RESULT_DIALOGUE);
      return undefined;
    }

    let characterIndex = 0;
    let cancelled = false;

    setTypedResultDialogue("");

    const typeNextCharacter = () => {
      if (cancelled) {
        return;
      }

      const character =
        RESULT_DIALOGUE[characterIndex];

      if (character === undefined) {
        return;
      }

      characterIndex += 1;

      setTypedResultDialogue(
        RESULT_DIALOGUE.slice(
          0,
          characterIndex
        )
      );

      playDialogueTypingSound(
        character,
        characterIndex
      );

      if (
        characterIndex <
        RESULT_DIALOGUE.length
      ) {
        const extraPause =
          character === "!" ||
            character === "."
            ? 150
            : character === "\n"
              ? 180
              : 0;

        resultDialogueTimerRef.current =
          window.setTimeout(
            typeNextCharacter,
            DIALOGUE_TYPE_SPEED +
            extraPause
          );
      }
    };

    resultDialogueTimerRef.current =
      window.setTimeout(
        typeNextCharacter,
        DIALOGUE_START_DELAY
      );

    return () => {
      cancelled = true;

      if (
        resultDialogueTimerRef.current
      ) {
        window.clearTimeout(
          resultDialogueTimerRef.current
        );
        resultDialogueTimerRef.current =
          null;
      }
    };
  }, [
    cameraError,
    capturedPhoto,
    isShooting,
  ]);

  const playCountdownSound = async (number) => {
    const frequency =
      number === 1 ? 980 : 660;
    await playTone(
      frequency,
      0.08,
      0.08
    );
  };
  const playShutterSound = async () => {
    const context = await getAudioContext();
    const bufferSize = Math.floor(
      context.sampleRate * 0.1
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
    gain.gain.value = 0.16;
    source.connect(gain);
    gain.connect(context.destination);
    source.start();
    await playTone(
      180,
      0.06,
      0.07
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
      cameraError ||
      !videoRef.current?.videoWidth
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
      await playCountdownSound(number);
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
    setDialogueCycle(
      (currentCycle) =>
        currentCycle + 1
    );
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
        .catch(() => { });
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
        .catch(() => { });
    }
    onBack?.();
  };
  useEffect(() => {
    let mounted = true;
    const initializeCamera = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: getVideoConstraints(),
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
            .catch(() => { });
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
          .catch(() => { });
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
    <div className="poke-photobooth-page">
      <div className="poke-pixel-grid" aria-hidden="true" />
      <div className="poke-photo-chibi-world" aria-hidden="true">
        <div className="poke-photo-chibi-runner poke-photo-chibi-runner-electric">
          <div className="poke-photo-chibi poke-photo-chibi-electric">
            <span className="poke-photo-chibi-ear poke-photo-chibi-ear-left" />
            <span className="poke-photo-chibi-ear poke-photo-chibi-ear-right" />
            <span className="poke-photo-chibi-face">
              <span className="poke-photo-chibi-eye poke-photo-chibi-eye-left" />
              <span className="poke-photo-chibi-eye poke-photo-chibi-eye-right" />
              <span className="poke-photo-chibi-cheek poke-photo-chibi-cheek-left" />
              <span className="poke-photo-chibi-cheek poke-photo-chibi-cheek-right" />
            </span>
            <span className="poke-photo-chibi-tail poke-photo-chibi-tail-electric" />
            <span className="poke-photo-chibi-feet" />
          </div>
        </div>
        <div className="poke-photo-chibi-runner poke-photo-chibi-runner-grass">
          <div className="poke-photo-chibi poke-photo-chibi-grass">
            <span className="poke-photo-chibi-bulb" />
            <span className="poke-photo-chibi-ear poke-photo-chibi-ear-left" />
            <span className="poke-photo-chibi-ear poke-photo-chibi-ear-right" />
            <span className="poke-photo-chibi-face">
              <span className="poke-photo-chibi-eye poke-photo-chibi-eye-left" />
              <span className="poke-photo-chibi-eye poke-photo-chibi-eye-right" />
              <span className="poke-photo-chibi-smile" />
            </span>
            <span className="poke-photo-chibi-feet" />
          </div>
        </div>
        <div className="poke-photo-chibi-runner poke-photo-chibi-runner-fire">
          <div className="poke-photo-chibi poke-photo-chibi-fire">
            <span className="poke-photo-chibi-face">
              <span className="poke-photo-chibi-eye poke-photo-chibi-eye-left" />
              <span className="poke-photo-chibi-eye poke-photo-chibi-eye-right" />
              <span className="poke-photo-chibi-smile" />
            </span>
            <span className="poke-photo-chibi-tail poke-photo-chibi-tail-fire" />
            <span className="poke-photo-chibi-feet" />
          </div>
        </div>
      </div>
      <main className="poke-photobooth-container">
        <header className="poke-photobooth-header">
          <button
            type="button"
            className="poke-photobooth-back"
            onClick={handleBack}
          >
            <ArrowLeftIcon />
            <span>BACK</span>
          </button>
          <div className="poke-photobooth-title">
            <span>POKEFRAME MODE</span>
            <strong>PIXEL PHOTO BATTLE</strong>
          </div>
          <div className="poke-photobooth-step">
            <PixelBallIcon />
            <span>
              {capturedPhoto
                ? "PHOTO CAUGHT"
                : "1 PHOTO"}
            </span>
          </div>
        </header>
        <section className="poke-photobooth-content">
          <div
            ref={cameraScreenRef}
            className="poke-pb-camera-screen"
          >
            <div
              className="poke-pb-camera-pixel-corners"
              aria-hidden="true"
            />
            {!cameraError && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`poke-pb-camera-video ${mirrored
                  ? "poke-pb-camera-mirrored"
                  : ""
                  }`}
              />
            )}
            {!cameraError && (
              <div
                className="poke-pb-camera-scanlines"
                aria-hidden="true"
              />
            )}
            {cameraError && (
              <div className="poke-pb-camera-error">
                <PixelBallIcon />
                <strong>
                  CAMERA NOT FOUND!
                </strong>
                <p>
                  {cameraError}
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                >
                  TRY AGAIN
                </button>
              </div>
            )}
            <div
              className={`poke-photo-preview ${capturedPhoto
                ? "poke-photo-preview-filled"
                : ""
                }`}
            >
              <div className="poke-photo-preview-header">
                <span>PHOTO 01</span>
                <span
                  className={`poke-preview-status ${capturedPhoto
                    ? "poke-preview-status-ready"
                    : ""
                    }`}
                >
                  {capturedPhoto
                    ? "CAUGHT"
                    : "EMPTY"}
                </span>
              </div>
              <div className="poke-photo-preview-image">
                {capturedPhoto ? (
                  <img
                    src={capturedPhoto}
                    alt="PokeFrame preview"
                  />
                ) : (
                  <div className="poke-photo-preview-empty">
                    <PixelBallIcon />
                    <span>NO PHOTO</span>
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
                  ? "EXIT"
                  : "FULL"}
              </span>
            </button>
            {!cameraError &&
              countdown && (
                <div className="poke-countdown">
                  <div className="poke-countdown-box">
                    <small>
                      {countdown === 1
                        ? "SMILE!"
                        : "GET READY"}
                    </small>
                    <strong>
                      {countdown}
                    </strong>
                  </div>
                </div>
              )}
            {flash && (
              <div className="poke-pb-camera-flash" />
            )}
            {!cameraError &&
              !isShooting &&
              !capturedPhoto && (
                <div className="poke-pb-camera-dialogue">
                  <div className="poke-dialogue-copy">
                    <span className="poke-dialogue-cursor">
                      ▶
                    </span>
                    <p>
                      {typedIntroDialogue
                        .split("\n")
                        .map(
                          (
                            line,
                            lineIndex
                          ) => (
                            <span
                              key={`${lineIndex}-${line}`}
                            >
                              {line}
                              {lineIndex === 0 &&
                                typedIntroDialogue.includes(
                                  "\n"
                                ) && <br />}
                            </span>
                          )
                        )}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="poke-capture-button"
                    onClick={takePhoto}
                    disabled={isShooting}
                  >
                    <CameraIcon />
                    <span>
                      {isShooting
                        ? "CAPTURING..."
                        : "CAPTURE"}
                    </span>
                  </button>
                </div>
              )}
            {finished && (
              <div className="poke-pb-camera-dialogue poke-pb-camera-dialogue-result">
                <div className="poke-dialogue-copy">
                  <span className="poke-dialogue-cursor">
                    ▶
                  </span>
                  <p>
                    {typedResultDialogue
                      .split("\n")
                      .map(
                        (
                          line,
                          lineIndex
                        ) => (
                          <span
                            key={`${lineIndex}-${line}`}
                          >
                            {line}
                            {lineIndex === 0 &&
                              typedResultDialogue.includes(
                                "\n"
                              ) && <br />}
                          </span>
                        )
                      )}
                  </p>
                </div>
                <div className="poke-result-actions">
                  <button
                    type="button"
                    className="poke-retake-button"
                    onClick={handleRetake}
                  >
                    <RefreshIcon />
                    <span>RETAKE</span>
                  </button>
                  <button
                    type="button"
                    className="poke-continue-button"
                    onClick={handleContinue}
                  >
                    <span>KEEP PHOTO</span>
                    <span aria-hidden="true">▶</span>
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

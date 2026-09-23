import {
    useEffect,
    useRef,
    useState,
  } from "react";
  import "./pose_match_photobooth.css";
  
  const TOTAL_SHOTS = 4;
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
  
  const filterMap = {
    original: {
      className: "pose-booth-filter-original",
      canvasFilter: "none",
    },
  
    soft: {
      className: "pose-booth-filter-soft",
      canvasFilter:
        "brightness(1.08) contrast(.9) saturate(.88)",
    },
  
    warm: {
      className: "pose-booth-filter-warm",
      canvasFilter:
        "brightness(1.04) contrast(1.02) saturate(1.08) sepia(.15)",
    },
  
    mono: {
      className: "pose-booth-filter-mono",
      canvasFilter:
        "grayscale(1) contrast(1.05) brightness(1.02)",
    },
  
    pop: {
      className: "pose-booth-filter-pop",
      canvasFilter:
        "saturate(1.55) contrast(1.08) brightness(1.04)",
    },
  
    sunset: {
      className: "pose-booth-filter-sunset",
      canvasFilter:
        "saturate(1.3) sepia(.2) hue-rotate(-8deg) contrast(1.04)",
    },
  
    candy: {
      className: "pose-booth-filter-candy",
      canvasFilter:
        "saturate(1.4) brightness(1.08) contrast(.96) hue-rotate(6deg)",
    },
  
    fresh: {
      className: "pose-booth-filter-fresh",
      canvasFilter:
        "saturate(1.24) brightness(1.06) contrast(1.02) hue-rotate(12deg)",
    },
  
    moody: {
      className: "pose-booth-filter-moody",
      canvasFilter:
        "brightness(.8) contrast(1.22) saturate(.78)",
    },
  
    noir: {
      className: "pose-booth-filter-noir",
      canvasFilter:
        "grayscale(1) brightness(.78) contrast(1.42)",
    },
  
    espresso: {
      className: "pose-booth-filter-espresso",
      canvasFilter:
        "sepia(.35) brightness(.8) contrast(1.18) saturate(.85)",
    },
  
    night: {
      className: "pose-booth-filter-night",
      canvasFilter:
        "brightness(.72) contrast(1.3) saturate(.76) hue-rotate(12deg)",
    },
  
    nokia: {
      className: "pose-booth-filter-nokia",
      canvasFilter:
        "brightness(.94) contrast(1.3) saturate(.48) sepia(.1)",
    },
  
    vhs: {
      className: "pose-booth-filter-vhs",
      canvasFilter:
        "brightness(.96) contrast(1.18) saturate(.72) sepia(.09) hue-rotate(-8deg)",
    },
  
    disposable: {
      className: "pose-booth-filter-disposable",
      canvasFilter:
        "brightness(1.1) contrast(.93) saturate(.86) sepia(.22)",
    },
  
    handycam: {
      className: "pose-booth-filter-handycam",
      canvasFilter:
        "brightness(.96) contrast(1.12) saturate(.68) sepia(.08)",
    },
  };
  
  function delay(milliseconds) {
    return new Promise(
      (resolve) => {
        setTimeout(
          resolve,
          milliseconds
        );
      }
    );
  }
  
  export default function PoseMatchPhotobooth({
    cameraId = "",
    mirrored = true,
    selectedFilter = "original",
    selectedStrip = "clean",
    selectedPoses = [],
    initialShots = [],
    onBack,
    onContinue,
  }) {
    const videoRef =
      useRef(null);
  
    const streamRef =
      useRef(null);
  
    const cameraScreenRef =
      useRef(null);
  
    const audioContextRef =
      useRef(null);
  
    const sessionTokenRef =
      useRef(0);
  
    const [
      cameraError,
      setCameraError,
    ] = useState("");
  
    const [
      countdown,
      setCountdown,
    ] = useState(null);
  
    const [
      shots,
      setShots,
    ] = useState(
      initialShots
    );
  
    const [
      isShooting,
      setIsShooting,
    ] = useState(false);
  
    const [
      isFullscreen,
      setIsFullscreen,
    ] = useState(false);
  
    const [
      flash,
      setFlash,
    ] = useState(false);
  
    const [
      currentReferenceIndex,
      setCurrentReferenceIndex,
    ] = useState(0);
  
    const filter =
      filterMap[
        selectedFilter
      ] ||
      filterMap.original;
  
    const currentReference =
      selectedPoses[
        currentReferenceIndex
      ];
  
    const stopCamera =
      () => {
        if (
          streamRef.current
        ) {
          streamRef.current
            .getTracks()
            .forEach(
              (
                track
              ) => {
                track.stop();
              }
            );
  
          streamRef.current =
            null;
        }
  
        if (
          videoRef.current
        ) {
          videoRef.current.srcObject =
            null;
        }
      };
  
    const getVideoConstraints =
      () => {
        if (cameraId) {
          return {
            deviceId: {
              exact:
                cameraId,
            },
  
            width: {
              ideal:
                1920,
            },
  
            height: {
              ideal:
                1080,
            },
          };
        }
  
        return {
          width: {
            ideal:
              1920,
          },
  
          height: {
            ideal:
              1080,
          },
  
          facingMode: {
            ideal:
              "user",
          },
        };
      };
  
    const startCamera =
      async () => {
        try {
          stopCamera();
  
          const stream =
            await navigator.mediaDevices.getUserMedia(
              {
                video:
                  getVideoConstraints(),
  
                audio:
                  false,
              }
            );
  
          streamRef.current =
            stream;
  
          if (
            videoRef.current
          ) {
            videoRef.current.srcObject =
              stream;
  
            await videoRef.current
              .play()
              .catch(
                () => {}
              );
          }
  
          setCameraError(
            ""
          );
        } catch {
          setCameraError(
            "Camera access is unavailable. Check your browser permission."
          );
        }
      };
  
    const getAudioContext =
      async () => {
        if (
          !audioContextRef.current
        ) {
          const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;
  
          if (
            !AudioContext
          ) {
            return null;
          }
  
          audioContextRef.current =
            new AudioContext();
        }
  
        if (
          audioContextRef.current
            .state ===
          "suspended"
        ) {
          await audioContextRef.current.resume();
        }
  
        return audioContextRef.current;
      };
  
    const playTone =
      async (
        frequency,
        duration,
        volume = 0.13
      ) => {
        const context =
          await getAudioContext();
  
        if (!context) {
          return;
        }
  
        const oscillator =
          context.createOscillator();
  
        const gain =
          context.createGain();
  
        oscillator.type =
          "sine";
  
        oscillator.frequency.value =
          frequency;
  
        gain.gain.setValueAtTime(
          volume,
          context.currentTime
        );
  
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          context.currentTime +
            duration
        );
  
        oscillator.connect(
          gain
        );
  
        gain.connect(
          context.destination
        );
  
        oscillator.start();
  
        oscillator.stop(
          context.currentTime +
            duration
        );
      };
  
    const playCountdownSound =
      async (
        number
      ) => {
        const frequency =
          number === 1
            ? 1000
            : 720;
  
        await playTone(
          frequency,
          0.1,
          0.12
        );
      };
  
    const playShutterSound =
      async () => {
        const context =
          await getAudioContext();
  
        if (!context) {
          return;
        }
  
        const bufferSize =
          Math.floor(
            context.sampleRate *
              0.12
          );
  
        const buffer =
          context.createBuffer(
            1,
            bufferSize,
            context.sampleRate
          );
  
        const data =
          buffer.getChannelData(
            0
          );
  
        for (
          let index = 0;
          index <
          bufferSize;
          index += 1
        ) {
          const fade =
            1 -
            index /
              bufferSize;
  
          data[index] =
            (Math.random() *
              2 -
              1) *
            fade;
        }
  
        const source =
          context.createBufferSource();
  
        const gain =
          context.createGain();
  
        source.buffer =
          buffer;
  
        gain.gain.value =
          0.22;
  
        source.connect(
          gain
        );
  
        gain.connect(
          context.destination
        );
  
        source.start();
  
        await playTone(
          150,
          0.07,
          0.09
        );
      };
  
    const capturePhoto =
      () => {
        const video =
          videoRef.current;
  
        if (
          !video ||
          !video.videoWidth ||
          !video.videoHeight
        ) {
          return null;
        }
  
        const canvas =
          document.createElement(
            "canvas"
          );
  
        canvas.width =
          video.videoWidth;
  
        canvas.height =
          video.videoHeight;
  
        const context =
          canvas.getContext(
            "2d"
          );
  
        context.save();
  
        context.filter =
          filter.canvasFilter;
  
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
  
    const runPhotoSession =
      async () => {
        if (
          isShooting ||
          cameraError
        ) {
          return;
        }
  
        if (
          !videoRef.current ||
          !videoRef.current
            .videoWidth
        ) {
          return;
        }
  
        await getAudioContext();
  
        const token =
          sessionTokenRef.current +
          1;
  
        sessionTokenRef.current =
          token;
  
        setShots([]);
        setCountdown(null);
        setCurrentReferenceIndex(
          0
        );
  
        setIsShooting(
          true
        );
  
        for (
          let shotIndex = 0;
          shotIndex <
          TOTAL_SHOTS;
          shotIndex += 1
        ) {
          setCurrentReferenceIndex(
            shotIndex
          );
  
          for (
            let number =
              COUNTDOWN_SECONDS;
            number >= 1;
            number -= 1
          ) {
            if (
              sessionTokenRef.current !==
              token
            ) {
              return;
            }
  
            setCountdown(
              number
            );
  
            await playCountdownSound(
              number
            );
  
            await delay(
              1000
            );
          }
  
          if (
            sessionTokenRef.current !==
            token
          ) {
            return;
          }
  
          setCountdown(
            null
          );
  
          setFlash(
            true
          );
  
          const photo =
            capturePhoto();
  
          playShutterSound();
  
          await delay(
            120
          );
  
          setFlash(
            false
          );
  
          if (photo) {
            setShots(
              (
                currentShots
              ) => [
                ...currentShots,
                photo,
              ]
            );
          }
  
          if (
            shotIndex <
            TOTAL_SHOTS - 1
          ) {
            setCurrentReferenceIndex(
              shotIndex +
                1
            );
  
            await delay(
              450
            );
          }
        }
  
        if (
          sessionTokenRef.current ===
          token
        ) {
          setCountdown(
            null
          );
  
          setIsShooting(
            false
          );
  
          setCurrentReferenceIndex(
            TOTAL_SHOTS -
              1
          );
        }
      };
  
    const handleAgain =
      () => {
        if (
          isShooting
        ) {
          return;
        }
  
        sessionTokenRef.current +=
          1;
  
        setCountdown(
          null
        );
  
        setFlash(
          false
        );
  
        setShots(
          []
        );
  
        setCurrentReferenceIndex(
          0
        );
      };
  
    const toggleFullscreen =
      async () => {
        try {
          if (
            !document.fullscreenElement
          ) {
            await cameraScreenRef.current?.requestFullscreen();
          } else {
            await document.exitFullscreen();
          }
        } catch {
          setIsFullscreen(
            false
          );
        }
      };
  
    const handleBack =
      () => {
        sessionTokenRef.current +=
          1;
  
        setIsShooting(
          false
        );
  
        setCountdown(
          null
        );
  
        stopCamera();
  
        if (
          document.fullscreenElement
        ) {
          document
            .exitFullscreen()
            .catch(
              () => {}
            );
        }
  
        onBack?.();
      };
  
    const handleContinue =
      () => {
        sessionTokenRef.current +=
          1;
  
        setIsShooting(
          false
        );
  
        setCountdown(
          null
        );
  
        stopCamera();
  
        if (
          document.fullscreenElement
        ) {
          document
            .exitFullscreen()
            .catch(
              () => {}
            );
        }
  
        onContinue?.(
          shots
        );
      };
  
    useEffect(() => {
      let mounted =
        true;
  
      const initializeCamera =
        async () => {
          try {
            const stream =
              await navigator.mediaDevices.getUserMedia(
                {
                  video:
                    getVideoConstraints(),
  
                  audio:
                    false,
                }
              );
  
            if (
              !mounted
            ) {
              stream
                .getTracks()
                .forEach(
                  (
                    track
                  ) => {
                    track.stop();
                  }
                );
  
              return;
            }
  
            streamRef.current =
              stream;
  
            if (
              videoRef.current
            ) {
              videoRef.current.srcObject =
                stream;
  
              videoRef.current
                .play()
                .catch(
                  () => {}
                );
            }
  
            setCameraError(
              ""
            );
          } catch {
            if (
              mounted
            ) {
              setCameraError(
                "Camera access is unavailable. Check your browser permission."
              );
            }
          }
        };
  
      initializeCamera();
  
      return () => {
        mounted =
          false;
  
        sessionTokenRef.current +=
          1;
  
        stopCamera();
  
        if (
          audioContextRef.current
        ) {
          audioContextRef.current
            .close()
            .catch(
              () => {}
            );
        }
      };
    }, [cameraId]);
  
    useEffect(() => {
      const handleFullscreenChange =
        () => {
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
      shots.length ===
        TOTAL_SHOTS &&
      !isShooting;
  
    return (
      <div className="pose-photobooth-page">
        <main className="pose-photobooth-container">
          <header className="pose-photobooth-header">
            <button
              type="button"
              className="pose-booth-back"
              onClick={
                handleBack
              }
            >
              <ArrowLeftIcon />
  
              <span>
                Back
              </span>
            </button>
  
            <div className="pose-booth-step">
              <span>
                Step 5
              </span>
  
              <strong>
                Photobooth
              </strong>
            </div>
  
            <div className="pose-booth-shot-count">
              <strong>
                {shots.length}/
                {TOTAL_SHOTS}
              </strong>
            </div>
          </header>
  
          <section className="pose-photobooth-content">
            <div className="pose-photobooth-layout">
              <div
                ref={
                  cameraScreenRef
                }
                className="pose-booth-camera"
              >
                {!cameraError && (
                  <video
                    ref={
                      videoRef
                    }
                    autoPlay
                    muted
                    playsInline
                    className={`pose-booth-video ${
                      mirrored
                        ? "pose-booth-video-mirrored"
                        : ""
                    } ${
                      filter.className
                    }`}
                  />
                )}
  
                {currentReference && (
                  <div className="pose-booth-reference">
                    <div className="pose-booth-reference-head">
                      <span>
                        Match this
                      </span>
  
                      <strong>
                        {currentReferenceIndex +
                          1}
                        /
                        {
                          TOTAL_SHOTS
                        }
                      </strong>
                    </div>
  
                    <div className="pose-booth-reference-image">
                      <img
                        src={
                          currentReference.image
                        }
                        alt={`Pose reference ${
                          currentReferenceIndex +
                          1
                        }`}
                      />
                    </div>
                  </div>
                )}
  
                {cameraError && (
                  <div className="pose-booth-camera-error">
                    <div className="pose-booth-error-icon">
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
                      onClick={
                        startCamera
                      }
                    >
                      Try Again
                    </button>
                  </div>
                )}
  
                {!cameraError &&
                  countdown && (
                    <div className="pose-booth-countdown">
                      <span>
                        {
                          countdown
                        }
                      </span>
  
                      <small>
                        {countdown ===
                        1
                          ? "Match it!"
                          : "Get ready"}
                      </small>
                    </div>
                  )}
  
                {flash && (
                  <div className="pose-booth-flash" />
                )}
  
                <button
                  type="button"
                  className="pose-booth-fullscreen"
                  onClick={
                    toggleFullscreen
                  }
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
                  shots.length ===
                    0 && (
                    <button
                      type="button"
                      className="pose-booth-start"
                      onClick={
                        runPhotoSession
                      }
                    >
                      Start
                    </button>
                  )}
  
                {finished && (
                  <div className="pose-booth-finished">
                    <div className="pose-booth-result-actions">
                      <button
                        type="button"
                        className="pose-booth-again"
                        onClick={
                          handleAgain
                        }
                      >
                        <RefreshIcon />
  
                        Again
                      </button>
  
                      <button
                        type="button"
                        className="pose-booth-continue"
                        onClick={
                          handleContinue
                        }
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>
  
              <aside className="pose-booth-output">

  
                <div className="pose-booth-shot-grid">
                  {Array.from({
                    length:
                      TOTAL_SHOTS,
                  }).map(
                    (
                      _,
                      index
                    ) => {
                      const shot =
                        shots[
                          index
                        ];
  
                      const reference =
                        selectedPoses[
                          index
                        ];
  
                      return (
                        <div
                          key={
                            index
                          }
                          className={`pose-booth-shot ${
                            shot
                              ? "pose-booth-shot-filled"
                              : ""
                          }`}
                        >
                          {shot ? (
                            <img
                              src={
                                shot
                              }
                              alt={`Shot ${
                                index +
                                1
                              }`}
                            />
                          ) : (
                            <>
                              {reference && (
                                <img
                                  className="pose-booth-shot-reference"
                                  src={
                                    reference.image
                                  }
                                  alt=""
                                />
                              )}
  
                              <span>
                                {index +
                                  1}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </aside>
            </div>
          </section>
        </main>
      </div>
    );
  }
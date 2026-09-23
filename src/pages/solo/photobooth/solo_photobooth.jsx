import {
  useEffect,
  useRef,
  useState,
} from "react";
import "./solo_photobooth.css";

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

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
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

const filterMap = {
  original: {
    className: "filter-original",
    effectClass: "",
    canvasFilter: "none",
  },

  soft: {
    className: "filter-soft",
    effectClass: "",
    canvasFilter:
      "brightness(1.08) contrast(.9) saturate(.88)",
  },

  warm: {
    className: "filter-warm",
    effectClass: "",
    canvasFilter:
      "brightness(1.04) contrast(1.02) saturate(1.08) sepia(.15)",
  },

  mono: {
    className: "filter-mono",
    effectClass: "",
    canvasFilter:
      "grayscale(1) contrast(1.05) brightness(1.02)",
  },

  nokia: {
    className: "filter-nokia",
    effectClass: "effect-nokia",
    canvasFilter:
      "brightness(.94) contrast(1.3) saturate(.48) sepia(.1)",
  },

  vhs: {
    className: "filter-vhs",
    effectClass: "effect-vhs",
    canvasFilter:
      "brightness(.96) contrast(1.18) saturate(.72) sepia(.09) hue-rotate(-8deg)",
  },

  disposable: {
    className:
      "filter-disposable",
    effectClass:
      "effect-disposable",
    canvasFilter:
      "brightness(1.1) contrast(.93) saturate(.86) sepia(.22)",
  },

  handycam: {
    className:
      "filter-handycam",
    effectClass:
      "effect-handycam",
    canvasFilter:
      "brightness(.96) contrast(1.12) saturate(.68) sepia(.08)",
  },

  moody: {
    className: "filter-moody",
    effectClass: "",
    canvasFilter:
      "brightness(.8) contrast(1.22) saturate(.78)",
  },

  noir: {
    className: "filter-noir",
    effectClass: "",
    canvasFilter:
      "grayscale(1) brightness(.78) contrast(1.42)",
  },

  espresso: {
    className:
      "filter-espresso",
    effectClass: "",
    canvasFilter:
      "sepia(.35) brightness(.8) contrast(1.18) saturate(.85)",
  },

  night: {
    className: "filter-night",
    effectClass: "",
    canvasFilter:
      "brightness(.72) contrast(1.3) saturate(.76) hue-rotate(12deg)",
  },
};

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function loadImage(source) {
  return new Promise(
    (resolve, reject) => {
      const image = new Image();

      image.onload = () =>
        resolve(image);

      image.onerror = reject;

      image.src = source;
    }
  );
}

export default function SoloPhotobooth({
  cameraId = "",
  mirrored = true,
  selectedFilter = "original",
  selectedStrip = "cream",
  onBack,
  onContinue,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
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
  ] = useState([]);

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

  const filter =
    filterMap[selectedFilter] ||
    filterMap.original;

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject =
        null;
    }
  };

  const getVideoConstraints =
    () => {
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

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video:
              getVideoConstraints(),

            audio: false,
          }
        );

      streamRef.current =
        stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current
          .play()
          .catch(() => {});
      }

      setCameraError("");
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

        audioContextRef.current =
          new AudioContext();
      }

      if (
        audioContextRef.current
          .state === "suspended"
      ) {
        await audioContextRef.current.resume();
      }

      return audioContextRef.current;
    };

  const playTone = async (
    frequency,
    duration,
    volume = 0.13
  ) => {
    const context =
      await getAudioContext();

    const oscillator =
      context.createOscillator();

    const gain =
      context.createGain();

    oscillator.type = "sine";
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

    oscillator.connect(gain);
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
    async (number) => {
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
        buffer.getChannelData(0);

      for (
        let index = 0;
        index < bufferSize;
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

      source.buffer = buffer;

      gain.gain.value = 0.22;

      source.connect(gain);

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

  const addVintageEffects = (
    canvas,
    context
  ) => {
    const {
      width,
      height,
    } = canvas;

    if (
      selectedFilter ===
      "nokia"
    ) {
      context.save();

      for (
        let y = 0;
        y < height;
        y += 4
      ) {
        context.fillStyle =
          "rgba(0,0,0,0.08)";

        context.fillRect(
          0,
          y,
          width,
          1
        );
      }

      for (
        let index = 0;
        index < 4500;
        index += 1
      ) {
        const x =
          Math.random() *
          width;

        const y =
          Math.random() *
          height;

        const alpha =
          Math.random() *
          0.16;

        context.fillStyle =
          `rgba(255,255,255,${alpha})`;

        context.fillRect(
          x,
          y,
          1.5,
          1.5
        );
      }

      context.restore();
    }

    if (
      selectedFilter === "vhs"
    ) {
      context.save();

      for (
        let y = 0;
        y < height;
        y += 5
      ) {
        context.fillStyle =
          "rgba(0,0,0,0.09)";

        context.fillRect(
          0,
          y,
          width,
          1
        );
      }

      context.fillStyle =
        "rgba(255,255,255,0.13)";

      context.fillRect(
        0,
        height * 0.62,
        width,
        5
      );

      context.restore();
    }

    if (
      selectedFilter ===
      "disposable"
    ) {
      context.save();

      for (
        let index = 0;
        index < 1800;
        index += 1
      ) {
        const x =
          Math.random() *
          width;

        const y =
          Math.random() *
          height;

        context.fillStyle =
          "rgba(255,255,255,0.08)";

        context.fillRect(
          x,
          y,
          1,
          1
        );
      }

      const vignette =
        context.createRadialGradient(
          width / 2,
          height / 2,
          width * 0.1,
          width / 2,
          height / 2,
          width * 0.7
        );

      vignette.addColorStop(
        0,
        "rgba(0,0,0,0)"
      );

      vignette.addColorStop(
        1,
        "rgba(40,20,5,0.25)"
      );

      context.fillStyle =
        vignette;

      context.fillRect(
        0,
        0,
        width,
        height
      );

      context.restore();
    }

    if (
      selectedFilter ===
      "handycam"
    ) {
      context.save();

      for (
        let y = 0;
        y < height;
        y += 4
      ) {
        context.fillStyle =
          "rgba(255,255,255,0.05)";

        context.fillRect(
          0,
          y,
          width,
          1
        );
      }

      context.restore();
    }
  };

  const capturePhoto = () => {
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
      canvas.getContext("2d");

    context.save();

    context.filter =
      filter.canvasFilter;

    if (mirrored) {
      context.translate(
        canvas.width,
        0
      );

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

    addVintageEffects(
      canvas,
      context
    );

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
      setIsShooting(true);

      for (
        let shotIndex = 0;
        shotIndex <
        TOTAL_SHOTS;
        shotIndex += 1
      ) {
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

          setCountdown(number);

          await playCountdownSound(
            number
          );

          await delay(1000);
        }

        if (
          sessionTokenRef.current !==
          token
        ) {
          return;
        }

        setCountdown(null);

        setFlash(true);

        const photo =
          capturePhoto();

        playShutterSound();

        await delay(120);

        setFlash(false);

        if (photo) {
          setShots(
            (currentShots) => [
              ...currentShots,
              photo,
            ]
          );
        }

        if (
          shotIndex <
          TOTAL_SHOTS - 1
        ) {
          await delay(350);
        }
      }

      if (
        sessionTokenRef.current ===
        token
      ) {
        setCountdown(null);
        setIsShooting(false);
      }
    };

  const handleAgain = () => {
    if (isShooting) {
      return;
    }

    sessionTokenRef.current += 1;
    setCountdown(null);
    setFlash(false);
    setShots([]);
  };

  const handleContinue = () => {
    sessionTokenRef.current += 1;

    setIsShooting(false);
    setCountdown(null);

    stopCamera();

    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .catch(() => {});
    }

    onContinue?.(shots);
  };

  const drawStripBackground = (
    context,
    width,
    height
  ) => {
    const dark =
      selectedStrip === "black";

    const basicColors = {
      cream: "#fff9f0",
      clean: "#ffffff",
      black: "#2e2e2e",
      film: "#e9e0d2",
      yellow: "#ffc629",
      coral: "#ff7b7b",
      sky: "#a5dcff",
      mint: "#b5ebc8",
    };

    if (
      basicColors[
        selectedStrip
      ]
    ) {
      context.fillStyle =
        basicColors[
          selectedStrip
        ];

      context.fillRect(
        0,
        0,
        width,
        height
      );
    } else {
      context.fillStyle =
        "#fff9f0";

      context.fillRect(
        0,
        0,
        width,
        height
      );
    }

    if (
      selectedStrip ===
      "checker"
    ) {
      const size = 34;

      for (
        let y = 0;
        y < height;
        y += size
      ) {
        for (
          let x = 0;
          x < width;
          x += size
        ) {
          context.fillStyle =
            ((x / size +
              y / size) %
              2 ===
            0)
              ? "#ffc629"
              : "#fff9f0";

          context.fillRect(
            x,
            y,
            size,
            size
          );
        }
      }
    }

    if (
      selectedStrip === "dots"
    ) {
      context.fillStyle =
        "#fff9f0";

      context.fillRect(
        0,
        0,
        width,
        height
      );

      context.fillStyle =
        "#ff7b7b";

      for (
        let y = 16;
        y < height;
        y += 34
      ) {
        for (
          let x = 16;
          x < width;
          x += 34
        ) {
          context.beginPath();

          context.arc(
            x,
            y,
            4,
            0,
            Math.PI * 2
          );

          context.fill();
        }
      }
    }

    if (
      selectedStrip === "retro"
    ) {
      context.fillStyle =
        "#ffc629";

      context.fillRect(
        0,
        0,
        width,
        height / 3
      );

      context.fillStyle =
        "#ff7b7b";

      context.fillRect(
        0,
        height / 3,
        width,
        height / 3
      );

      context.fillStyle =
        "#fff9f0";

      context.fillRect(
        0,
        (height / 3) * 2,
        width,
        height / 3
      );
    }

    if (
      selectedStrip === "smile"
    ) {
      context.fillStyle =
        "#fff9f0";

      context.fillRect(
        0,
        0,
        width,
        height
      );

      context.fillStyle =
        "#ffc629";

      context.beginPath();
      context.arc(
        60,
        70,
        24,
        0,
        Math.PI * 2
      );
      context.fill();

      context.fillStyle =
        "#ff7b7b";

      context.beginPath();
      context.arc(
        width - 60,
        150,
        20,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    return dark
      ? "#ffffff"
      : "#2e2e2e";
  };

  const drawCoverImage = (
    context,
    image,
    x,
    y,
    width,
    height
  ) => {
    const imageRatio =
      image.width /
      image.height;

    const targetRatio =
      width / height;

    let sourceWidth =
      image.width;

    let sourceHeight =
      image.height;

    let sourceX = 0;
    let sourceY = 0;

    if (
      imageRatio >
      targetRatio
    ) {
      sourceWidth =
        image.height *
        targetRatio;

      sourceX =
        (image.width -
          sourceWidth) /
        2;
    } else {
      sourceHeight =
        image.width /
        targetRatio;

      sourceY =
        (image.height -
          sourceHeight) /
        2;
    }

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      x,
      y,
      width,
      height
    );
  };

  const handleDownload =
    async () => {
      if (
        shots.length !==
        TOTAL_SHOTS
      ) {
        return;
      }

      const images =
        await Promise.all(
          shots.map(
            (shot) =>
              loadImage(shot)
          )
        );

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width = 600;
      canvas.height = 1800;

      const context =
        canvas.getContext("2d");

      const textColor =
        drawStripBackground(
          context,
          canvas.width,
          canvas.height
        );

      const padding = 26;
      const gap = 14;

      const footerHeight =
        220;

      const photoWidth =
        canvas.width -
        padding * 2;

      const usableHeight =
        canvas.height -
        padding * 2 -
        footerHeight -
        gap * 3;

      const photoHeight =
        usableHeight /
        TOTAL_SHOTS;

      images.forEach(
        (image, index) => {
          const y =
            padding +
            index *
              (photoHeight +
                gap);

          drawCoverImage(
            context,
            image,
            padding,
            y,
            photoWidth,
            photoHeight
          );
        }
      );

      const footerY =
        canvas.height -
        footerHeight;

      context.textAlign =
        "center";

      context.fillStyle =
        textColor;

      context.font =
        "700 28px Arial";

      context.fillText(
        "Smile with Memories",
        canvas.width / 2,
        footerY + 65
      );

      context.font =
        "600 20px Arial";

      context.fillText(
        "SMORA",
        canvas.width / 2,
        footerY + 108
      );

      context.font =
        "500 17px Arial";

      context.globalAlpha =
        0.7;

      context.fillText(
        new Date().toLocaleDateString(),
        canvas.width / 2,
        footerY + 148
      );

      context.globalAlpha = 1;

      const link =
        document.createElement(
          "a"
        );

      link.download =
        `smora-${Date.now()}.jpg`;

      link.href =
        canvas.toDataURL(
          "image/jpeg",
          0.95
        );

      link.click();
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
        setIsFullscreen(false);
      }
    };

  const handleBack = () => {
    sessionTokenRef.current += 1;

    setIsShooting(false);
    setCountdown(null);

    stopCamera();

    if (
      document.fullscreenElement
    ) {
      document
        .exitFullscreen()
        .catch(() => {});
    }

    onBack?.();
  };

  useEffect(() => {
    let mounted = true;

    const initializeCamera =
      async () => {
        try {
          const stream =
            await navigator.mediaDevices.getUserMedia(
              {
                video:
                  getVideoConstraints(),

                audio: false,
              }
            );

          if (!mounted) {
            stream
              .getTracks()
              .forEach(
                (track) => {
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

      if (
        audioContextRef.current
      ) {
        audioContextRef.current
          .close()
          .catch(() => {});
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
            <span>Step 4</span>
            <strong>
              Photobooth
            </strong>
          </div>

          <div className="photobooth-shot-count">
            <strong>
              {shots.length}/
              {TOTAL_SHOTS}
            </strong>
          </div>
        </header>

        <section className="solo-photobooth-content">
          <div className="solo-photobooth-layout">
            <div
              ref={
                cameraScreenRef
              }
              className={`photobooth-camera-screen ${
                filter.effectClass
              }`}
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
                  } ${
                    filter.className
                  }`}
                />
              )}

              {cameraError && (
                <div className="photobooth-camera-error">
                  <div className="photobooth-error-icon">
                    <CameraIcon />
                  </div>

                  <strong>
                    Camera access
                    needed
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
                  <div className="photobooth-countdown">
                    <span>
                      {countdown}
                    </span>

                    <small>
                      {countdown ===
                      1
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
                shots.length === 0 && (
                  <button
                    type="button"
                    className="photobooth-start-button"
                    onClick={
                      runPhotoSession
                    }
                  >
                    Start
                  </button>
                )}

              {finished && (
                <div className="photobooth-finished-overlay">
                  <div className="photobooth-result-actions">
                    <button
                      type="button"
                      className="photobooth-again-button"
                      onClick={
                        handleAgain
                      }
                    >
                      <RefreshIcon />
                      Again
                    </button>

                    <button
                      type="button"
                      className="photobooth-download-button"
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

            <aside className="photobooth-output-panel">
              <div className="photobooth-shot-grid">
                {Array.from({
                  length:
                    TOTAL_SHOTS,
                }).map(
                  (_, index) => {
                    const shot =
                      shots[index];

                    return (
                      <div
                        key={index}
                        className={`photobooth-shot ${
                          shot
                            ? "photobooth-shot-filled"
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
                          <span>
                            {index +
                              1}
                          </span>
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
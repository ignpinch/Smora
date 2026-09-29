import { useEffect, useRef, useState } from "react";
import "./solo_camera.css";

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

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function FlipIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h13" />
      <path d="m13 4 3 3-3 3" />
      <path d="M21 17H8" />
      <path d="m11 14-3 3 3 3" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H3v5" />
      <path d="M16 3h5v5" />
      <path d="M8 21H3v-5" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 8H3V3" />
      <path d="m3 8 5-5" />
      <path d="M16 8h5V3" />
      <path d="m21 8-5-5" />
      <path d="M8 16H3v5" />
      <path d="m3 16 5 5" />
      <path d="M16 16h5v5" />
      <path d="m21 16-5 5" />
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

export default function SoloCamera({ onBack, onContinue }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const previewRef = useRef(null);

  const [mirrored, setMirrored] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");

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

  const getAvailableCameras = async () => {
    try {
      const devices =
        await navigator.mediaDevices.enumerateDevices();

      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      setCameras(videoDevices);

      return videoDevices;
    } catch {
      setCameras([]);
      return [];
    }
  };

  const startCamera = async (deviceId = "") => {
    try {
      stopCamera();

      const constraints = deviceId
        ? {
            video: {
              deviceId: {
                exact: deviceId,
              },
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
            },
            audio: false,
          }
        : {
            video: {
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
              facingMode: {
                ideal: "user",
              },
            },
            audio: false,
          };

      const stream =
        await navigator.mediaDevices.getUserMedia(
          constraints
        );

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const track = stream.getVideoTracks()[0];
      const settings = track?.getSettings();

      if (settings?.deviceId) {
        setSelectedCamera(settings.deviceId);
      }

      setCameraError("");

      await getAvailableCameras();
    } catch {
      setCameraError(
        "Allow camera access in your browser to continue."
      );
    }
  };

  const handleCameraChange = async (event) => {
    const deviceId = event.target.value;

    setSelectedCamera(deviceId);

    await startCamera(deviceId);
  };

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await previewRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setFullscreen(false);
    }
  };

  const handleBack = () => {
    stopCamera();
    onBack?.();
  };

  const handleContinue = () => {
    stopCamera();

    onContinue?.({
      mirrored,
      cameraId: selectedCamera,
    });
  };

  useEffect(() => {
    let mounted = true;

    const initializeCamera = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
              facingMode: {
                ideal: "user",
              },
            },
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
        }

        const track = stream.getVideoTracks()[0];
        const settings = track?.getSettings();

        if (settings?.deviceId) {
          setSelectedCamera(settings.deviceId);
        }

        setCameraError("");

        const devices =
          await navigator.mediaDevices.enumerateDevices();

        if (mounted) {
          setCameras(
            devices.filter(
              (device) =>
                device.kind === "videoinput"
            )
          );
        }
      } catch {
        if (mounted) {
          setCameraError(
            "Allow camera access in your browser to continue."
          );
        }
      }
    };

    initializeCamera();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(
        Boolean(document.fullscreenElement)
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

  return (
    <div className="solo-camera-page">
      <main className="solo-camera-container">
        <header className="solo-camera-header">
          <button
            type="button"
            className="camera-back-button"
            onClick={handleBack}
          >
            <ArrowLeftIcon />
            <span>Back</span>
          </button>

          <div className="camera-current-step">
            <span>Step 1</span>
            <strong>Camera Settings</strong>
          </div>

          <div className="camera-next-step">
            <div className="next-step-text">
              <span>Next</span>
              <strong>Filter</strong>
            </div>
          </div>
        </header>

        <section className="solo-camera-content">
          <div className="camera-layout">
            <div
              ref={previewRef}
              className="camera-preview"
            >
              <div className="camera-preview-top">
                <div className="camera-status">
                  <span className="camera-status-dot" />
                  <span>Camera Preview</span>
                </div>

                <button
                  type="button"
                  className="fullscreen-button"
                  onClick={handleFullscreen}
                  aria-label={
                    fullscreen
                      ? "Exit fullscreen"
                      : "Enter fullscreen"
                  }
                >
                  {fullscreen ? (
                    <MinimizeIcon />
                  ) : (
                    <ExpandIcon />
                  )}
                </button>
              </div>

              <div className="camera-screen">
                {!cameraError && (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={
                      mirrored
                        ? "camera-video camera-video-mirrored"
                        : "camera-video"
                    }
                  />
                )}

                {cameraError && (
                  <div className="camera-error">
                    <div className="camera-error-icon">
                      <CameraIcon />
                    </div>

                    <strong>
                      Camera access needed
                    </strong>

                    <p>{cameraError}</p>

                    <button
                      type="button"
                      onClick={() =>
                        startCamera(
                          selectedCamera
                        )
                      }
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>

            <aside className="camera-settings-panel">
              <div className="camera-settings-heading">
                <span>Setup</span>
                <h2>Your Camera</h2>
              </div>

              <div className="camera-setting-group">
                <label htmlFor="camera-select">
                  Select camera
                </label>

                <select
                  id="camera-select"
                  value={selectedCamera}
                  onChange={handleCameraChange}
                >
                  {cameras.length === 0 && (
                    <option value="">
                      Default camera
                    </option>
                  )}

                  {cameras.map(
                    (camera, index) => (
                      <option
                        key={
                          camera.deviceId ||
                          index
                        }
                        value={
                          camera.deviceId
                        }
                      >
                        {camera.label ||
                          `Camera ${
                            index + 1
                          }`}
                      </option>
                    )
                  )}
                </select>
              </div>

              <button
                type="button"
                className={`mirror-control ${
                  mirrored
                    ? "mirror-control-active"
                    : ""
                }`}
                onClick={() =>
                  setMirrored(
                    (current) =>
                      !current
                  )
                }
              >
                <div className="mirror-control-left">
                  <FlipIcon />
                  <span>Mirror</span>
                </div>

                <div
                  className={`mirror-switch ${
                    mirrored
                      ? "mirror-switch-active"
                      : ""
                  }`}
                >
                  <span />
                </div>
              </button>

              <div className="settings-spacer" />

              <button
                type="button"
                className="camera-continue-button"
                onClick={handleContinue}
                disabled={Boolean(cameraError)}
              >
                <span>Continue</span>
                <ArrowRightIcon />
              </button>

            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
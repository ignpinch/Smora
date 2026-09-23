import {
  useEffect,
  useRef,
  useState,
} from "react";
import "./solo_strip.css";

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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CustomizeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h10" />
      <path d="M18 7h2" />
      <circle cx="16" cy="7" r="2" />

      <path d="M4 12h5" />
      <path d="M13 12h7" />
      <circle cx="11" cy="12" r="2" />

      <path d="M4 17h2" />
      <path d="M10 17h10" />
      <circle cx="8" cy="17" r="2" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const stripDesigns = [
  {
    id: "clean",
    name: "Clean",
    className: "strip-clean",
  },
  {
    id: "black",
    name: "Black",
    className: "strip-black",
  },
  {
    id: "film",
    name: "Film",
    className: "strip-film",
  },
  {
    id: "yellow",
    name: "Yellow",
    className: "strip-yellow",
  },
  {
    id: "coral",
    name: "Coral",
    className: "strip-coral",
  },
  {
    id: "sky",
    name: "Sky",
    className: "strip-sky",
  },
  {
    id: "mint",
    name: "Mint",
    className: "strip-mint",
  },
  {
    id: "checker",
    name: "Checker",
    className: "strip-checker",
  },
];

function getFilterClass(filter) {
  const filters = {
    original: "preview-filter-original",
    soft: "preview-filter-soft",
    warm: "preview-filter-warm",
    mono: "preview-filter-mono",
    pop: "preview-filter-pop",
    sunset: "preview-filter-sunset",
    candy: "preview-filter-candy",
    fresh: "preview-filter-fresh",
    moody: "preview-filter-moody",
    noir: "preview-filter-noir",
    espresso: "preview-filter-espresso",
    night: "preview-filter-night",
  };

  return (
    filters[filter] ||
    "preview-filter-original"
  );
}

function StripDesignButton({
  strip,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`strip-design-button ${
        active
          ? "strip-design-button-active"
          : ""
      }`}
      onClick={onClick}
      aria-pressed={active}
    >
      <div
        className={`strip-design-thumbnail ${strip.className}`}
      >
        <div className="strip-design-mini-photo" />
        <div className="strip-design-mini-photo" />
        <div className="strip-design-mini-photo" />
        <div className="strip-design-mini-photo" />

        <div className="strip-design-mini-footer" />
      </div>

      <span>{strip.name}</span>

      {active && (
        <div className="strip-design-check">
          <CheckIcon />
        </div>
      )}
    </button>
  );
}

function StripDesignGrid({
  activeStrip,
  onSelect,
}) {
  return (
    <div className="strip-design-grid">
      {stripDesigns.map(
        (strip) => (
          <StripDesignButton
            key={strip.id}
            strip={strip}
            active={
              activeStrip ===
              strip.id
            }
            onClick={() =>
              onSelect(
                strip.id
              )
            }
          />
        )
      )}
    </div>
  );
}

export default function SoloStrip({
  cameraId = "",
  mirrored = true,
  selectedFilter = "original",
  selectedStrip = "cream",
  onBack,
  onContinue,
}) {
  const videoRefs =
    useRef([]);

  const streamRef =
    useRef(null);

  const [
    activeStrip,
    setActiveStrip,
  ] = useState(
    selectedStrip ||
      "cream"
  );

  const [
    cameraError,
    setCameraError,
  ] = useState("");

  const [
    showMobileCustomize,
    setShowMobileCustomize,
  ] = useState(false);

  const currentStrip =
    stripDesigns.find(
      (strip) =>
        strip.id ===
        activeStrip
    ) ||
    stripDesigns[0];

  const filterClass =
    getFilterClass(
      selectedFilter
    );

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
              1280,
          },

          height: {
            ideal:
              720,
          },
        };
      }

      return {
        width: {
          ideal:
            1280,
        },

        height: {
          ideal:
            720,
        },

        facingMode: {
          ideal:
            "user",
        },
      };
    };

  const attachCamera = (
    stream
  ) => {
    videoRefs.current.forEach(
      (video) => {
        if (!video) {
          return;
        }

        video.srcObject =
          stream;

        video
          .play()
          .catch(
            () => {}
          );
      }
    );
  };

  const stopCamera = () => {
    if (
      streamRef.current
    ) {
      streamRef.current
        .getTracks()
        .forEach(
          (track) => {
            track.stop();
          }
        );

      streamRef.current =
        null;
    }

    videoRefs.current.forEach(
      (video) => {
        if (video) {
          video.srcObject =
            null;
        }
      }
    );
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

        attachCamera(
          stream
        );

        setCameraError(
          ""
        );
      } catch {
        setCameraError(
          "Camera access is unavailable. Check your browser permission."
        );
      }
    };

  useEffect(() => {
    setActiveStrip(
      selectedStrip ||
        "cream"
    );
  }, [selectedStrip]);

  useEffect(() => {
    let mounted =
      true;

    const initializeCamera =
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

          if (!mounted) {
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

          attachCamera(
            stream
          );

          setCameraError(
            ""
          );
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
      mounted =
        false;

      stopCamera();
    };
  }, [cameraId]);

  const handleBack = () => {
    stopCamera();

    onBack?.();
  };

  const handleContinue =
    () => {
      stopCamera();

      onContinue?.(
        activeStrip
      );
    };

  return (
    <div className="solo-strip-page">
      <main className="solo-strip-container">
        <header className="solo-strip-header">
          <button
            type="button"
            className="strip-back-button"
            onClick={
              handleBack
            }
          >
            <ArrowLeftIcon />

            <span>
              Back
            </span>
          </button>

          <div className="strip-current-step">
            <span>
              Step 3
            </span>

            <strong>
              Strip Design
            </strong>
          </div>

          <div className="strip-next-step">
            <div>
              <span>
                Next
              </span>

              <strong>
                Photobooth
              </strong>
            </div>

          
          </div>
        </header>

        <section className="strip-page-heading">
          <h1>
            Choose your{" "}
            <span>
              strip.
            </span>
          </h1>

          <p>
            Preview your strip before you start snapping.
          </p>
        </section>

        <section className="solo-strip-layout">
          <div className="solo-strip-preview-column">
            <div className="strip-mobile-customize-top">
              <button
                type="button"
                className={`strip-customize-button ${
                  showMobileCustomize
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setShowMobileCustomize(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                aria-expanded={
                  showMobileCustomize
                }
              >
                <CustomizeIcon />

                <span>
                  Customize Strip
                </span>

                <span className="strip-customize-chevron">
                  <ChevronIcon />
                </span>
              </button>

              {showMobileCustomize && (
                <div className="strip-mobile-customize-panel">
                  <div className="strip-mobile-customize-heading">
                    <span>
                      Strip
                    </span>

                    <strong>
                      Pick a design
                    </strong>
                  </div>

                  <StripDesignGrid
                    activeStrip={
                      activeStrip
                    }
                    onSelect={
                      setActiveStrip
                    }
                  />
                </div>
              )}
            </div>

            {!cameraError ? (
              <div
                className={`solo-strip-preview ${currentStrip.className}`}
              >
                {[0, 1, 2, 3].map(
                  (
                    index
                  ) => (
                    <div
                      className="solo-strip-photo"
                      key={
                        index
                      }
                    >
                      <video
                        ref={(
                          element
                        ) => {
                          videoRefs.current[
                            index
                          ] =
                            element;
                        }}
                        autoPlay
                        muted
                        playsInline
                        className={`solo-strip-video ${
                          mirrored
                            ? "solo-strip-video-mirrored"
                            : ""
                        } ${filterClass}`}
                      />
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="strip-camera-error">
                <div className="strip-error-icon">
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

            <div className="strip-mobile-controls">
              <button
                type="button"
                className="strip-mobile-continue"
                disabled={
                  Boolean(
                    cameraError
                  )
                }
                onClick={
                  handleContinue
                }
              >
                Continue

                <ArrowRightIcon />
              </button>
            </div>
          </div>

          <aside className="strip-design-panel">
            <div className="strip-design-heading">
              <span>
                Strip
              </span>

              <h2>
                Pick a design
              </h2>
            </div>

            <StripDesignGrid
              activeStrip={
                activeStrip
              }
              onSelect={
                setActiveStrip
              }
            />

            <button
              type="button"
              className="strip-desktop-continue"
              disabled={
                Boolean(
                  cameraError
                )
              }
              onClick={
                handleContinue
              }
            >
              Continue

              <ArrowRightIcon />
            </button>
          </aside>
        </section>
      </main>
    </div>
  );
}
import {
  useEffect,
  useRef,
  useState,
} from "react";
import "./pose_match_strip.css";

const stripDesigns = [
  {
    id: "cream",
    name: "Cream",
    className: "pose-strip-cream",
  },
  {
    id: "clean",
    name: "Clean",
    className: "pose-strip-clean",
  },
  {
    id: "black",
    name: "Black",
    className: "pose-strip-black",
  },
  {
    id: "yellow",
    name: "Yellow",
    className: "pose-strip-yellow",
  },
  {
    id: "coral",
    name: "Coral",
    className: "pose-strip-coral",
  },
  {
    id: "sky",
    name: "Sky",
    className: "pose-strip-sky",
  },
  {
    id: "mint",
    name: "Mint",
    className: "pose-strip-mint",
  },
  {
    id: "checker",
    name: "Checker",
    className: "pose-strip-checker",
  },
];

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
      <circle
        cx="12"
        cy="13"
        r="4"
      />
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
      <circle
        cx="16"
        cy="7"
        r="2"
      />

      <path d="M4 12h5" />
      <path d="M13 12h7" />
      <circle
        cx="11"
        cy="12"
        r="2"
      />

      <path d="M4 17h2" />
      <path d="M10 17h10" />
      <circle
        cx="8"
        cy="17"
        r="2"
      />
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

function getFilterClass(filter) {
  const filters = {
    original:
      "pose-preview-filter-original",

    soft:
      "pose-preview-filter-soft",

    warm:
      "pose-preview-filter-warm",

    mono:
      "pose-preview-filter-mono",

    pop:
      "pose-preview-filter-pop",

    sunset:
      "pose-preview-filter-sunset",

    candy:
      "pose-preview-filter-candy",

    fresh:
      "pose-preview-filter-fresh",

    moody:
      "pose-preview-filter-moody",

    noir:
      "pose-preview-filter-noir",

    espresso:
      "pose-preview-filter-espresso",

    night:
      "pose-preview-filter-night",

    disposable:
      "pose-preview-filter-disposable",

    handycam:
      "pose-preview-filter-handycam",
  };

  return (
    filters[filter] ||
    filters.original
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
      className={`pose-design-button ${
        active
          ? "pose-design-button-active"
          : ""
      }`}
      onClick={onClick}
      aria-pressed={active}
    >
      <div
        className={`pose-design-thumbnail ${strip.className}`}
      >
        <div className="pose-design-mini-grid">
          {Array.from({
            length: 8,
          }).map(
            (
              _,
              index
            ) => (
              <span
                key={index}
                className={
                  index % 2 === 0
                    ? "mini-user"
                    : "mini-reference"
                }
              />
            )
          )}
        </div>
      </div>

      <span>
        {strip.name}
      </span>

      {active && (
        <div className="pose-design-check">
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
    <div className="pose-design-grid">
      {stripDesigns.map(
        (
          strip
        ) => (
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

export default function PoseMatchStrip({
  cameraId = "",
  mirrored = true,
  selectedFilter = "original",
  selectedPoses = [],
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
      (
        strip
      ) =>
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

      videoRefs.current.forEach(
        (
          video
        ) => {
          if (video) {
            video.srcObject =
              null;
          }
        }
      );
    };

  const attachCamera = (
    stream
  ) => {
    videoRefs.current.forEach(
      (
        video
      ) => {
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
          "Camera preview unavailable."
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

    const initialize =
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

          attachCamera(
            stream
          );

          setCameraError(
            ""
          );
        } catch {
          if (
            mounted
          ) {
            setCameraError(
              "Camera preview unavailable."
            );
          }
        }
      };

    initialize();

    return () => {
      mounted =
        false;

      stopCamera();
    };
  }, [cameraId]);

  const handleBack =
    () => {
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
    <div className="pose-strip-page">
      <main className="pose-strip-container">
        <header className="pose-strip-header">
          <button
            type="button"
            className="pose-strip-back"
            onClick={
              handleBack
            }
          >
            <ArrowLeftIcon />

            <span>
              Back
            </span>
          </button>

          <div className="pose-strip-current-step">
            <span>
              Step 4
            </span>

            <strong>
              Strip Design
            </strong>
          </div>

          <div className="pose-strip-next-step">
            <span>
              Next
            </span>

            <strong>
              Photo Booth
            </strong>
          </div>
        </header>

        <section className="pose-strip-hero">
          <h1>
            Choose your{" "}
            <span>
              strip.
            </span>
          </h1>

          <p>
            Your photo will appear beside each reference.
          </p>
        </section>

        <section className="pose-strip-layout">
          <div className="pose-strip-preview-area">
            <div className="pose-mobile-customize-top">
              <button
                type="button"
                className={`pose-customize-button ${
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

                <span className="pose-customize-chevron">
                  <ChevronIcon />
                </span>
              </button>

              {showMobileCustomize && (
                <div className="pose-mobile-customize-panel">
                  <div className="pose-mobile-customize-heading">
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

            <div
              className={`pose-match-strip ${currentStrip.className}`}
            >
              {Array.from({
                length:
                  4,
              }).map(
                (
                  _,
                  index
                ) => {
                  const pose =
                    selectedPoses[
                      index
                    ];

                  return (
                    <div
                      className="pose-strip-row"
                      key={
                        index
                      }
                    >
                      <div className="pose-strip-square pose-strip-user">
                        {cameraError ? (
                          <div className="pose-camera-placeholder">
                            <CameraIcon />
                          </div>
                        ) : (
                          <video
                            ref={(
                              element
                            ) => {
                              videoRefs.current[
                                index
                              ] =
                                element;
                            }}
                            className={`pose-strip-video ${filterClass}`}
                            autoPlay
                            muted
                            playsInline
                            style={{
                              transform:
                                mirrored
                                  ? "scaleX(-1)"
                                  : "scaleX(1)",
                            }}
                          />
                        )}
                      </div>

                      <div className="pose-strip-square pose-strip-reference">
                        {pose ? (
                          <img
                            src={
                              pose.image
                            }
                            alt={`Reference ${
                              index +
                              1
                            }`}
                          />
                        ) : (
                          <span className="pose-empty-reference">
                            ?
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {cameraError && (
              <button
                type="button"
                className="pose-camera-retry"
                onClick={
                  startCamera
                }
              >
                Retry camera
              </button>
            )}

            <button
              type="button"
              className="pose-mobile-continue"
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

          <aside className="pose-strip-design-panel">
            <div className="pose-strip-design-heading">
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
              className="pose-strip-continue"
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
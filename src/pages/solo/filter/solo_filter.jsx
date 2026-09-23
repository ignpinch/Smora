import { useEffect, useRef, useState } from "react";
import "./solo_filter.css";

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

const filterGroups = {
  classic: [
    {
      id: "original",
      name: "Original",
      className: "filter-original",
    },
    {
      id: "soft",
      name: "Soft",
      className: "filter-soft",
    },
    {
      id: "warm",
      name: "Warm",
      className: "filter-warm",
    },
    {
      id: "mono",
      name: "Mono",
      className: "filter-mono",
    },
  ],

  vibrant: [
    {
      id: "pop",
      name: "Pop",
      className: "filter-pop",
    },
    {
      id: "sunset",
      name: "Sunset",
      className: "filter-sunset",
    },
    {
      id: "candy",
      name: "Candy",
      className: "filter-candy",
    },
    {
      id: "fresh",
      name: "Fresh",
      className: "filter-fresh",
    },
  ],

  dark: [
    {
      id: "moody",
      name: "Moody",
      className: "filter-moody",
    },
    {
      id: "noir",
      name: "Noir",
      className: "filter-noir",
    },
    {
      id: "espresso",
      name: "Espresso",
      className: "filter-espresso",
    },
    {
      id: "night",
      name: "Night",
      className: "filter-night",
    },
  ],
};

const allFilters = Object.values(filterGroups).flat();

export default function SoloFilter({
  cameraId = "",
  mirrored = true,
  selectedFilter = "original",
  onBack,
  onContinue,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [activeCategory, setActiveCategory] =
    useState("classic");

  const [activeFilter, setActiveFilter] =
    useState(selectedFilter || "original");

  const [cameraError, setCameraError] =
    useState("");

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

  const startCamera = async () => {
    try {
      stopCamera();

      const videoConstraints = cameraId
        ? {
            deviceId: {
              exact: cameraId,
            },
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          }
        : {
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
            facingMode: {
              ideal: "user",
            },
          };

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraError("");
    } catch {
      setCameraError(
        "Camera access is unavailable. Check your browser permission."
      );
    }
  };

  const handleBack = () => {
    stopCamera();
    onBack?.();
  };

  const handleContinue = () => {
    stopCamera();
    onContinue?.(activeFilter);
  };

  const currentFilter =
    allFilters.find(
      (filter) => filter.id === activeFilter
    ) || allFilters[0];

  const visibleFilters =
    filterGroups[activeCategory];

  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    const categoryFilters =
      filterGroups[category];

    const selectedIsInsideCategory =
      categoryFilters.some(
        (filter) =>
          filter.id === activeFilter
      );

    if (!selectedIsInsideCategory) {
      setActiveFilter(
        categoryFilters[0].id
      );
    }
  };

  useEffect(() => {
    const selectedGroup = Object.entries(
      filterGroups
    ).find(([, filters]) =>
      filters.some(
        (filter) =>
          filter.id === selectedFilter
      )
    );

    if (selectedGroup) {
      setActiveCategory(
        selectedGroup[0]
      );
    }
  }, [selectedFilter]);

  useEffect(() => {
    let mounted = true;

    const initializeCamera = async () => {
      try {
        const videoConstraints = cameraId
          ? {
              deviceId: {
                exact: cameraId,
              },
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
            }
          : {
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
              facingMode: {
                ideal: "user",
              },
            };

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
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

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;
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
      stopCamera();
    };
  }, [cameraId]);

  return (
    <div className="solo-filter-page">
      <main className="solo-filter-container">
        <header className="solo-filter-header">
          <button
            type="button"
            className="filter-back-button"
            onClick={handleBack}
          >
            <ArrowLeftIcon />
            <span>Back</span>
          </button>

          <div className="filter-current-step">
            <span>Step 2</span>
            <strong>Choose Filter</strong>
          </div>

          <div className="filter-next-step">
            <div>
              <span>Next</span>
              <strong>Strip Design</strong>
            </div>
          </div>
        </header>

        <section className="solo-filter-content">
          <div className="solo-filter-layout">
            <div className="filter-camera-card">
              <div className="filter-preview-top">
                <div className="filter-preview-status">
                  <span className="filter-status-dot" />
                  Live Preview
                </div>

                <span className="active-filter-name">
                  {currentFilter.name}
                </span>
              </div>

              <div className="filter-camera-screen">
                {!cameraError && (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`filter-camera-video ${
                      mirrored
                        ? "filter-camera-mirrored"
                        : ""
                    } ${currentFilter.className}`}
                  />
                )}

                {cameraError && (
                  <div className="filter-camera-error">
                    <div className="filter-error-icon">
                      <CameraIcon />
                    </div>

                    <strong>
                      Camera access needed
                    </strong>

                    <p>{cameraError}</p>

                    <button
                      type="button"
                      onClick={startCamera}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>

            <aside className="filter-panel">
              <div className="filter-panel-heading">
                <span>Filter</span>
                <h2>Pick your look</h2>
              </div>

              <div className="filter-category-tabs">
                <button
                  type="button"
                  className={
                    activeCategory ===
                    "classic"
                      ? "filter-category active"
                      : "filter-category"
                  }
                  onClick={() =>
                    handleCategoryChange(
                      "classic"
                    )
                  }
                >
                  Classic
                </button>

                <button
                  type="button"
                  className={
                    activeCategory ===
                    "vibrant"
                      ? "filter-category active"
                      : "filter-category"
                  }
                  onClick={() =>
                    handleCategoryChange(
                      "vibrant"
                    )
                  }
                >
                  Vibrant
                </button>

                <button
                  type="button"
                  className={
                    activeCategory ===
                    "dark"
                      ? "filter-category active"
                      : "filter-category"
                  }
                  onClick={() =>
                    handleCategoryChange(
                      "dark"
                    )
                  }
                >
                  Dark
                </button>
              </div>

              <div className="filter-grid">
                {visibleFilters.map(
                  (filter) => {
                    const isActive =
                      activeFilter ===
                      filter.id;

                    return (
                      <button
                        key={filter.id}
                        type="button"
                        className={`filter-option ${
                          isActive
                            ? "filter-option-active"
                            : ""
                        }`}
                        onClick={() =>
                          setActiveFilter(
                            filter.id
                          )
                        }
                      >
                        <div
                          className={`filter-option-preview ${filter.className}`}
                        >
                          <div className="filter-demo">
                            <div className="filter-demo-head">
                              <span />
                              <span />
                            </div>

                            <div className="filter-demo-body" />
                          </div>

                          {isActive && (
                            <div className="filter-check">
                              <CheckIcon />
                            </div>
                          )}
                        </div>

                        <span>
                          {filter.name}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              <div className="filter-panel-spacer" />

              <button
                type="button"
                className="filter-continue-button"
                disabled={Boolean(
                  cameraError
                )}
                onClick={handleContinue}
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
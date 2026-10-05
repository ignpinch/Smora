import { useMemo, useState } from "react";
import "./poke_output.css";
import darkFrame from "../../../assets/PokeFrame/dark_frame.png";
import electricFrame from "../../../assets/PokeFrame/electric_frame.png";
import fightingFrame from "../../../assets/PokeFrame/fighting_frame.png";
import fireFrame from "../../../assets/PokeFrame/fire_frame.png";
const CARD_WIDTH = 750;
const CARD_HEIGHT = 1050;
const PHOTO_WINDOW = {
  x: 63,
  y: 110,
  width: 630,
  height: 387,
};
const CARD_FONT =
  '"Gill Sans", "Gill Sans MT", Calibri, sans-serif';
// DOWNLOADED NAME POSITION: x = left/right, y = up/down, maxWidth = maximum text width.
const DOWNLOAD_NAME_POSITION = {
  x: 145,
  y: 70,
  maxWidth: 350,
};
const FILTER_OPTIONS = [
  {
    id: "natural",
    label: "Natural",
    css: "brightness(1.03) contrast(1.04) saturate(1.06)",
    canvas: "brightness(1.03) contrast(1.04) saturate(1.06)",
  },
  {
    id: "golden-hour",
    label: "Golden Hour",
    css: "brightness(1.06) contrast(1.08) saturate(1.12) sepia(0.12) hue-rotate(-6deg)",
    canvas:
      "brightness(1.06) contrast(1.08) saturate(1.12) sepia(0.12) hue-rotate(-6deg)",
  },
  {
    id: "noir",
    label: "Noir",
    css: "grayscale(1) contrast(1.22) brightness(0.9)",
    canvas: "grayscale(1) contrast(1.22) brightness(0.9)",
  },
  {
    id: "animated",
    label: "Animated",
    css: "brightness(1.06) contrast(1.28) saturate(1.55)",
    canvas: "brightness(1.06) contrast(1.18) saturate(1.4)",
    animated: true,
  },
];
const FRAME_OPTIONS = [
  {
    id: "dark",
    label: "Dark",
    image: darkFrame,
    textColor: "#ffffff",
  },
  {
    id: "electric",
    label: "Electric",
    image: electricFrame,
    textColor: "#000",
  },
  {
    id: "fighting",
    label: "Fighting",
    image: fightingFrame,
    textColor: "#000",
  },
  {
    id: "fire",
    label: "Fire",
    image: fireFrame,
    textColor: "#000",
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
function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.7 10.7 6.6-4.4" />
      <path d="m8.7 13.3 6.6 4.4" />
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
function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}
function FrameIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function TextIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M12 6v14" />
      <path d="M8 20h8" />
    </svg>
  );
}
function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = reject;
    image.src = source;
  });
}
function drawCoverImage(
  context,
  image,
  x,
  y,
  width,
  height
) {
  const imageRatio =
    image.width / image.height;
  const targetRatio =
    width / height;
  let sourceWidth =
    image.width;
  let sourceHeight =
    image.height;
  let sourceX = 0;
  let sourceY = 0;
  if (imageRatio > targetRatio) {
    sourceWidth =
      image.height * targetRatio;
    sourceX =
      (image.width - sourceWidth) / 2;
  } else {
    sourceHeight =
      image.width / targetRatio;
    sourceY =
      (image.height - sourceHeight) / 2;
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
}
function applyAnimatedEffect(
  context,
  x,
  y,
  width,
  height
) {
  const imageData = context.getImageData(
    x,
    y,
    width,
    height
  );
  const source = new Uint8ClampedArray(
    imageData.data
  );
  const data = imageData.data;
  const step = 42;
  const getLuminance = (index) => {
    return (
      source[index] * 0.299 +
      source[index + 1] * 0.587 +
      source[index + 2] * 0.114
    );
  };
  for (
    let row = 0;
    row < height;
    row += 1
  ) {
    for (
      let column = 0;
      column < width;
      column += 1
    ) {
      const index =
        (row * width + column) * 4;
      const average =
        (source[index] +
          source[index + 1] +
          source[index + 2]) /
        3;
      let red =
        average +
        (source[index] - average) * 1.35;
      let green =
        average +
        (source[index + 1] - average) * 1.35;
      let blue =
        average +
        (source[index + 2] - average) * 1.35;
      red =
        Math.round(red / step) * step;
      green =
        Math.round(green / step) * step;
      blue =
        Math.round(blue / step) * step;
      const currentLuminance =
        getLuminance(index);
      const rightIndex =
        column < width - 1
          ? index + 4
          : index;
      const downIndex =
        row < height - 1
          ? index + width * 4
          : index;
      const edgeStrength =
        Math.abs(
          currentLuminance -
          getLuminance(rightIndex)
        ) +
        Math.abs(
          currentLuminance -
          getLuminance(downIndex)
        );
      const edgeFactor =
        edgeStrength > 62
          ? 0.55
          : 1;
      data[index] = Math.max(
        0,
        Math.min(
          255,
          red * edgeFactor
        )
      );
      data[index + 1] = Math.max(
        0,
        Math.min(
          255,
          green * edgeFactor
        )
      );
      data[index + 2] = Math.max(
        0,
        Math.min(
          255,
          blue * edgeFactor
        )
      );
    }
  }
  context.putImageData(
    imageData,
    x,
    y
  );
}
function wrapText(
  context,
  text,
  maxWidth
) {
  const cleanText =
    text.trim();
  if (!cleanText) {
    return [];
  }
  const words =
    cleanText.split(/\s+/);
  const lines = [];
  let currentLine = "";
  words.forEach((word) => {
    const testLine =
      currentLine
        ? `${currentLine} ${word}`
        : word;
    if (
      context.measureText(testLine).width >
      maxWidth &&
      currentLine
    ) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}
function Field({
  icon,
  label,
  value,
  placeholder,
  maxLength,
  multiline = false,
  onChange,
}) {
  return (
    <div className="poke-setting-row">
      <div className="poke-setting-label">
        <span className="poke-setting-icon">
          {icon}
        </span>
        <div className="poke-setting-copy">
          <strong>{label}</strong>
          <small>
            {value.length}/{maxLength}
          </small>
        </div>
      </div>
      <div className="poke-setting-field">
        {multiline ? (
          <textarea
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(event) => {
              onChange(
                event.target.value
              );
            }}
          />
        ) : (
          <input
            type="text"
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(event) => {
              onChange(
                event.target.value
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
export default function PokeOutput({
  photo = "",
  onBack,
  onStartOver,
}) {
  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState("natural");
  const [
    selectedFrame,
    setSelectedFrame,
  ] = useState("dark");
  const [
    openLookSection,
    setOpenLookSection,
  ] = useState("filter");
  const [
    name,
    setName,
  ] = useState("");
  const [
    powerName,
    setPowerName,
  ] = useState("");
  const [
    powerDescription,
    setPowerDescription,
  ] = useState("");
  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false);
  const [
    showMobileCustomize,
    setShowMobileCustomize,
  ] = useState(false);
  const [
    isSharing,
    setIsSharing,
  ] = useState(false);
  const currentFilter = useMemo(() => {
    return (
      FILTER_OPTIONS.find(
        (filter) =>
          filter.id === selectedFilter
      ) || FILTER_OPTIONS[0]
    );
  }, [selectedFilter]);
  const currentFrame = useMemo(() => {
    return (
      FRAME_OPTIONS.find(
        (frame) =>
          frame.id === selectedFrame
      ) || FRAME_OPTIONS[0]
    );
  }, [selectedFrame]);
  const createCardCanvas = async () => {
    const canvas =
      document.createElement("canvas");
    canvas.width =
      CARD_WIDTH;
    canvas.height =
      CARD_HEIGHT;
    const context =
      canvas.getContext("2d");
    if (!context) {
      throw new Error(
        "Could not create card canvas."
      );
    }
    context.clearRect(
      0,
      0,
      CARD_WIDTH,
      CARD_HEIGHT
    );
    if (photo) {
      const capturedPhoto =
        await loadImage(photo);
      context.save();
      context.beginPath();
      context.rect(
        PHOTO_WINDOW.x,
        PHOTO_WINDOW.y,
        PHOTO_WINDOW.width,
        PHOTO_WINDOW.height
      );
      context.clip();
      context.filter =
        currentFilter.canvas;
      drawCoverImage(
        context,
        capturedPhoto,
        PHOTO_WINDOW.x,
        PHOTO_WINDOW.y,
        PHOTO_WINDOW.width,
        PHOTO_WINDOW.height
      );
      context.filter = "none";
      context.restore();
      if (currentFilter.animated) {
        applyAnimatedEffect(
          context,
          PHOTO_WINDOW.x,
          PHOTO_WINDOW.y,
          PHOTO_WINDOW.width,
          PHOTO_WINDOW.height
        );
      }
    } else {
      context.fillStyle =
        "#d9d5cf";
      context.fillRect(
        PHOTO_WINDOW.x,
        PHOTO_WINDOW.y,
        PHOTO_WINDOW.width,
        PHOTO_WINDOW.height
      );
    }
    const frameImage =
      await loadImage(
        currentFrame.image
      );
    context.drawImage(
      frameImage,
      0,
      0,
      CARD_WIDTH,
      CARD_HEIGHT
    );
    context.fillStyle =
      currentFrame.textColor;
    context.textBaseline =
      "middle";
    if (name.trim()) {
      context.textAlign =
        "left";
      context.font =
        `700 37px ${CARD_FONT}`;
      context.fillText(
        name.trim(),
        DOWNLOAD_NAME_POSITION.x,
        DOWNLOAD_NAME_POSITION.y,
        DOWNLOAD_NAME_POSITION.maxWidth
      );
    }
    if (powerName.trim()) {
      context.textAlign =
        "center";
      context.font =
        `700 34px ${CARD_FONT}`;
      context.fillText(
        powerName.trim(),
        CARD_WIDTH / 2,
        706,
        400
      );
    }
    if (
      powerDescription.trim()
    ) {
      context.textAlign =
        "left";
      context.textBaseline =
        "top";
      context.font =
        `600 23px ${CARD_FONT}`;
      const lines =
        wrapText(
          context,
          powerDescription,
          620
        ).slice(0, 4);
      lines.forEach(
        (line, index) => {
          context.fillText(
            line,
            58,
            748 + index * 29,
            620
          );
        }
      );
    }
    return canvas;
  };
  const downloadCanvas = (
    canvas,
    fileName
  ) => {
    const link =
      document.createElement("a");
    link.download =
      fileName;
    link.href =
      canvas.toDataURL(
        "image/png"
      );
    link.click();
  };
  const canvasToBlob = (
    canvas
  ) => {
    return new Promise(
      (resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
              return;
            }
            reject(
              new Error(
                "Could not create share image."
              )
            );
          },
          "image/png",
          0.96
        );
      }
    );
  };
  const handleDownload = async () => {
    if (isDownloading) {
      return;
    }
    setIsDownloading(true);
    try {
      const canvas =
        await createCardCanvas();
      downloadCanvas(
        canvas,
        `smora-pokeframe-${Date.now()}.png`
      );
    } catch (error) {
      console.error(
        "Unable to export PokeFrame:",
        error
      );
    } finally {
      setIsDownloading(false);
    }
  };
  const handleShare = async () => {
    if (isSharing) {
      return;
    }
    setIsSharing(true);
    try {
      const canvas =
        await createCardCanvas();
      const blob =
        await canvasToBlob(
          canvas
        );
      const file = new File(
        [blob],
        `smora-pokeframe-${Date.now()}.png`,
        {
          type: "image/png",
        }
      );
      const canShareFile =
        typeof navigator.share ===
        "function" &&
        (
          typeof navigator.canShare !==
          "function" ||
          navigator.canShare({
            files: [file],
          })
        );
      if (canShareFile) {
        await navigator.share({
          title:
            "My Smora PokeFrame",
          text:
            "Made with Smora — Smile with Memories.",
          files: [file],
        });
      } else {
        downloadCanvas(
          canvas,
          file.name
        );
      }
    } catch (error) {
      if (
        error?.name !==
        "AbortError"
      ) {
        console.error(
          "Unable to share PokeFrame:",
          error
        );
      }
    } finally {
      setIsSharing(false);
    }
  };
  const lookControls = (
    <div className="poke-look-controls">
      <div
        className={`poke-look-section ${openLookSection === "filter"
          ? "poke-look-section-open"
          : ""
          }`}
      >
        <button
          type="button"
          className="poke-look-section-button"
          onClick={() => {
            setOpenLookSection(
              openLookSection === "filter"
                ? ""
                : "filter"
            );
          }}
          aria-expanded={
            openLookSection === "filter"
          }
        >
          <span className="poke-look-section-title">
            <span className="poke-look-section-icon">
              <FilterIcon />
            </span>
            <span>
              <h3 className="poke-look-section-heading">
                Filter
              </h3>
            </span>
          </span>
          <span className="poke-look-section-current">
            <p>{currentFilter.label}</p>
            <span className="poke-look-section-chevron">
              <ChevronDownIcon />
            </span>
          </span>
        </button>
        {openLookSection === "filter" && (
          <div className="poke-filter-grid">
            {FILTER_OPTIONS.map(
              (filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`poke-filter-option ${selectedFilter ===
                    filter.id
                    ? "active"
                    : ""
                    }`}
                  onClick={() => {
                    setSelectedFilter(
                      filter.id
                    );
                  }}
                >
                  <span className="poke-filter-preview">
                    {photo ? (
                      <>
                        <img
                          src={photo}
                          alt=""
                          style={{
                            filter:
                              filter.css,
                          }}
                        />
                        {filter.animated && (
                          <img
                            src={photo}
                            alt=""
                            aria-hidden="true"
                            className="poke-filter-animated-edge"
                          />
                        )}
                      </>
                    ) : (
                      <span className="poke-filter-placeholder">
                        A
                      </span>
                    )}
                  </span>
                  <span className="poke-filter-name">
                    {filter.label}
                  </span>
                </button>
              )
            )}
          </div>
        )}
      </div>
      <div
        className={`poke-look-section ${openLookSection === "frame"
          ? "poke-look-section-open"
          : ""
          }`}
      >
        <button
          type="button"
          className="poke-look-section-button"
          onClick={() => {
            setOpenLookSection(
              openLookSection === "frame"
                ? ""
                : "frame"
            );
          }}
          aria-expanded={
            openLookSection === "frame"
          }
        >
          <span className="poke-look-section-title">
            <span className="poke-look-section-icon">
              <FrameIcon />
            </span>
            <span>
              <h3 className="poke-look-section-heading">
                Choose Frame
              </h3>
            </span>
          </span>
          <span className="poke-look-section-current">
            <p>
              {currentFrame.label}
            </p>
            <span className="poke-look-section-chevron">
              <ChevronDownIcon />
            </span>
          </span>
        </button>
        {openLookSection === "frame" && (
          <div className="poke-frame-grid">
            {FRAME_OPTIONS.map(
              (frame) => (
                <button
                  key={frame.id}
                  type="button"
                  className={`poke-frame-option ${selectedFrame ===
                    frame.id
                    ? "active"
                    : ""
                    }`}
                  onClick={() => {
                    setSelectedFrame(
                      frame.id
                    );
                  }}
                >
                  <span className="poke-frame-preview">
                    <img
                      src={frame.image}
                      alt=""
                    />
                  </span>
                  <p className="poke-frame-name">
                    {frame.label}
                  </p>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
  const settings = (
    <div className="poke-settings-content">
      <Field
        icon={<TextIcon />}
        label="Name"
        value={name}
        placeholder="Enter your name"
        maxLength={16}
        onChange={setName}
      />
      <Field
        icon={<TextIcon />}
        label="Power Name"
        value={powerName}
        placeholder="Enter power name"
        maxLength={22}
        onChange={setPowerName}
      />
      <Field
        icon={<EditIcon />}
        label="Power Description"
        value={powerDescription}
        placeholder="Describe your power"
        maxLength={110}
        multiline
        onChange={setPowerDescription}
      />
    </div>
  );
  return (
    <div className="poke-output-page">
      <main className="poke-output-container">
        <header className="poke-output-header">
          <button
            type="button"
            className="poke-output-back-button"
            onClick={onBack}
          >
            <ArrowLeftIcon />
            <span>Back</span>
          </button>
          <div className="poke-output-current-step">
            <span>Step 3</span>
            <strong>
              Final Output
            </strong>
          </div>
          <div className="poke-output-ready-state">
            <span>Ready</span>
            <strong>
              Download
            </strong>
          </div>
        </header>
        <section className="poke-output-content">
          <div className="poke-output-layout">
            <aside className="poke-output-look-panel">
              <div className="poke-output-look-panel-header">
                <div className="poke-output-look-panel-icon">
                  <FrameIcon />
                </div>
                <div>
                  <h2 className="poke-output-look-panel-title">
                    Style
                  </h2>
                </div>
              </div>
              {lookControls}
            </aside>
            <div className="poke-output-preview-column">
              <div className="poke-output-mobile-toolbar">
                <button
                  type="button"
                  className="poke-mobile-tool-button"
                  onClick={onStartOver}
                  aria-label="Start over"
                >
                  <RefreshIcon />
                </button>
                <button
                  type="button"
                  className="poke-mobile-tool-button poke-mobile-download-tool"
                  disabled={isDownloading}
                  onClick={handleDownload}
                  aria-label="Download"
                >
                  <DownloadIcon />
                </button>
                <button
                  type="button"
                  className="poke-mobile-tool-button poke-mobile-share-tool"
                  disabled={isSharing}
                  onClick={handleShare}
                  aria-label="Share"
                >
                  <ShareIcon />
                </button>
                <button
                  type="button"
                  className="poke-mobile-customize-button"
                  onClick={() => {
                    setShowMobileCustomize(
                      true
                    );
                  }}
                >
                  <EditIcon />
                  <span>
                    Customize
                  </span>
                </button>
              </div>
              <div className="poke-card-preview">
                <div className="poke-card-photo-window">
                  {photo ? (
                    <>
                      <img
                        src={photo}
                        alt="PokeFrame capture"
                        style={{
                          filter:
                            currentFilter.css,
                        }}
                      />
                      {currentFilter.animated && (
                        <img
                          src={photo}
                          alt=""
                          aria-hidden="true"
                          className="poke-card-photo-animated-edge"
                        />
                      )}
                    </>
                  ) : (
                    <span>
                      Your photo
                    </span>
                  )}
                </div>
                <img
                  src={currentFrame.image}
                  alt={`${currentFrame.label} frame`}
                  className="poke-card-frame-overlay"
                />
                <p
                  className={`poke-card-name ${name.trim()
                    ? ""
                    : "poke-card-placeholder"
                    }`}
                  style={{
                    color:
                      currentFrame.textColor,
                  }}
                >
                  {name.trim() ||
                    "NAME"}
                </p>
                <p
                  className={`poke-card-power-name ${powerName.trim()
                    ? ""
                    : "poke-card-placeholder"
                    }`}
                  style={{
                    color:
                      currentFrame.textColor,
                  }}
                >
                  {powerName.trim() ||
                    "Power Name"}
                </p>
                <p
                  className={`poke-card-power-description ${powerDescription.trim()
                    ? ""
                    : "poke-card-placeholder"
                    }`}
                  style={{
                    color:
                      currentFrame.textColor,
                  }}
                >
                  {powerDescription.trim() ||
                    "Write your power description here."}
                </p>
              </div>
            </div>
            <aside className="poke-output-edit-panel">
              <div className="poke-output-panel-header">
                <div className="poke-output-panel-header-icon">
                  <EditIcon />
                </div>
                <h2>
                  Customize
                </h2>
              </div>
              {settings}
              <div className="poke-output-actions">
                <div className="poke-output-action-row">
                  <button
                    type="button"
                    className="poke-output-action-button poke-output-download-button"
                    disabled={isDownloading}
                    onClick={handleDownload}
                    aria-label="Download"
                  >
                    <DownloadIcon />
                  </button>
                  <button
                    type="button"
                    className="poke-output-action-button poke-output-share-button"
                    disabled={isSharing}
                    onClick={handleShare}
                    aria-label="Share"
                  >
                    <ShareIcon />
                  </button>
                  <button
                    type="button"
                    className="poke-output-action-button poke-output-start-over-button"
                    onClick={onStartOver}
                    aria-label="Start over"
                  >
                    <RefreshIcon />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      {showMobileCustomize && (
        <div className="poke-mobile-customize-overlay">
          <div
            className="poke-mobile-customize-panel"
            role="dialog"
            aria-modal="true"
          >
            <div className="poke-mobile-customize-header">
              <div className="poke-mobile-customize-header-icon">
                <EditIcon />
              </div>
              <h2>
                Customize
              </h2>
            </div>
            <div className="poke-mobile-look-section">
              <span className="poke-mobile-customize-subtitle">
                Look
              </span>
              {lookControls}
            </div>
            <div className="poke-mobile-settings-section">
              <span className="poke-mobile-customize-subtitle">
                Details
              </span>
              {settings}
            </div>
            <button
              type="button"
              className="poke-mobile-customize-okay"
              onClick={() => {
                setShowMobileCustomize(
                  false
                );
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

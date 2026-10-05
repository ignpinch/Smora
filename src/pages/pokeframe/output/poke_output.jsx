import { useMemo, useState } from "react";

import "./poke_output.css";

import smoraPrimary from "../../../assets/smora-primary.png";

import darkFrame from "../../../assets/PokeFrame/dark_frame.png";

import electricFrame from "../../../assets/PokeFrame/electric_frame.png";

import fightingFrame from "../../../assets/PokeFrame/fighting_frame.png";

import fireFrame from "../../../assets/PokeFrame/fire_frame.png";

const CARD_WIDTH = 750;

const CARD_HEIGHT = 1050;

const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;
const STORY_FONT = '"Courier New", "Lucida Console", monospace';

const STORY_THEMES = {
  dark: {
    accent: "#303030",
    accentDark: "#202020",
    highlight: "#f7d154",
    secondary: "#4f77b8",
  },
  electric: {
    accent: "#f7d154",
    accentDark: "#b98c16",
    highlight: "#fff4a8",
    secondary: "#4f77b8",
  },
  fighting: {
    accent: "#df7654",
    accentDark: "#9f3e29",
    highlight: "#f7d154",
    secondary: "#4f77b8",
  },
  fire: {
    accent: "#f08b48",
    accentDark: "#b84b2f",
    highlight: "#f7d154",
    secondary: "#df4a4a",
  },
};

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

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height
  );
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function drawPixelGrid(context) {
  context.save();
  context.strokeStyle = "rgba(32, 32, 32, 0.055)";
  context.lineWidth = 2;

  for (let x = 0; x <= STORY_WIDTH; x += 36) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, STORY_HEIGHT);
    context.stroke();
  }

  for (let y = 0; y <= STORY_HEIGHT; y += 36) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(STORY_WIDTH, y);
    context.stroke();
  }

  context.restore();
}

function drawPixelBall(context, x, y, size, rotation = 0) {
  const radius = size / 2;

  context.save();
  context.translate(x, y);
  context.rotate(rotation);

  context.fillStyle = "#ffffff";
  context.strokeStyle = "#202020";
  context.lineWidth = Math.max(5, size * 0.08);

  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.save();
  context.beginPath();
  context.arc(0, 0, radius - context.lineWidth / 2, Math.PI, Math.PI * 2);
  context.clip();
  context.fillStyle = "#df4a4a";
  context.fillRect(-radius, -radius, size, radius);
  context.restore();

  context.fillStyle = "#202020";
  context.fillRect(
    -radius + context.lineWidth * 0.35,
    -context.lineWidth / 2,
    size - context.lineWidth * 0.7,
    context.lineWidth
  );

  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(0, 0, size * 0.13, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.restore();
}

function drawPixelSparkle(context, x, y, size, color) {
  const unit = size / 5;

  context.save();
  context.fillStyle = color;

  context.fillRect(x - unit / 2, y - size / 2, unit, size);
  context.fillRect(x - size / 2, y - unit / 2, size, unit);
  context.fillRect(x - unit * 1.5, y - unit * 1.5, unit, unit);
  context.fillRect(x + unit * 0.5, y + unit * 0.5, unit, unit);

  context.restore();
}

function drawChibiFace(context, fillColor) {
  context.fillStyle = fillColor;
  context.strokeStyle = "#202020";
  context.lineWidth = 4;

  roundedRectPath(context, -24, -20, 48, 42, 14);
  context.fill();
  context.stroke();

  context.fillStyle = "#202020";
  context.fillRect(-13, -6, 5, 7);
  context.fillRect(8, -6, 5, 7);

  context.fillStyle = "#df4a4a";
  context.fillRect(-20, 6, 7, 5);
  context.fillRect(13, 6, 7, 5);

  context.strokeStyle = "#202020";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(-4, 8);
  context.lineTo(0, 12);
  context.lineTo(5, 8);
  context.stroke();

  context.fillStyle = "#202020";
  context.fillRect(-17, 21, 12, 6);
  context.fillRect(5, 21, 12, 6);
}

function drawElectricChibi(context, x, y, scale = 1) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);

  context.strokeStyle = "#202020";
  context.lineWidth = 4;
  context.fillStyle = "#f7d154";

  context.save();
  context.translate(-12, -28);
  context.rotate(-0.25);
  context.fillRect(-6, -17, 12, 24);
  context.strokeRect(-6, -17, 12, 24);
  context.fillStyle = "#202020";
  context.fillRect(-6, -17, 12, 8);
  context.restore();

  context.save();
  context.translate(12, -28);
  context.rotate(0.25);
  context.fillStyle = "#f7d154";
  context.fillRect(-6, -17, 12, 24);
  context.strokeRect(-6, -17, 12, 24);
  context.fillStyle = "#202020";
  context.fillRect(-6, -17, 12, 8);
  context.restore();

  drawChibiFace(context, "#f7d154");

  context.fillStyle = "#f7d154";
  context.strokeStyle = "#202020";
  context.lineWidth = 4;
  context.save();
  context.translate(31, 3);
  context.rotate(-0.42);
  context.fillRect(-3, -4, 24, 9);
  context.strokeRect(-3, -4, 24, 9);
  context.fillRect(16, -13, 10, 9);
  context.strokeRect(16, -13, 10, 9);
  context.restore();

  context.restore();
}

function drawGrassChibi(context, x, y, scale = 1) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);

  context.strokeStyle = "#202020";
  context.lineWidth = 4;

  context.fillStyle = "#5f9b4b";
  context.beginPath();
  context.ellipse(0, -26, 19, 16, 0, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.fillStyle = "#77a956";
  context.save();
  context.translate(-10, -41);
  context.rotate(-0.45);
  context.fillRect(-5, -11, 10, 18);
  context.strokeRect(-5, -11, 10, 18);
  context.restore();

  context.save();
  context.translate(10, -41);
  context.rotate(0.45);
  context.fillRect(-5, -11, 10, 18);
  context.strokeRect(-5, -11, 10, 18);
  context.restore();

  context.fillStyle = "#82c7a5";
  context.fillRect(-18, -27, 9, 16);
  context.strokeRect(-18, -27, 9, 16);
  context.fillRect(9, -27, 9, 16);
  context.strokeRect(9, -27, 9, 16);

  drawChibiFace(context, "#82c7a5");

  context.restore();
}

function drawFireChibi(context, x, y, scale = 1) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);

  context.strokeStyle = "#202020";
  context.lineWidth = 4;
  context.fillStyle = "#f08b48";

  context.fillRect(-18, -28, 10, 18);
  context.strokeRect(-18, -28, 10, 18);
  context.fillRect(8, -28, 10, 18);
  context.strokeRect(8, -28, 10, 18);

  drawChibiFace(context, "#f08b48");

  context.save();
  context.translate(28, 8);
  context.rotate(-0.35);
  context.fillStyle = "#f08b48";
  context.fillRect(0, -4, 23, 9);
  context.strokeRect(0, -4, 23, 9);

  context.translate(24, -5);
  context.rotate(0.35);
  context.fillStyle = "#df4a4a";
  context.beginPath();
  context.moveTo(0, 12);
  context.lineTo(8, -13);
  context.lineTo(17, 3);
  context.lineTo(20, 16);
  context.lineTo(8, 20);
  context.closePath();
  context.fill();
  context.stroke();

  context.fillStyle = "#f7d154";
  context.beginPath();
  context.moveTo(7, 13);
  context.lineTo(11, -2);
  context.lineTo(15, 10);
  context.lineTo(14, 15);
  context.closePath();
  context.fill();
  context.restore();

  context.restore();
}

function drawStoryDialogue(context, theme) {
  const x = 155;
  const y = 1335;
  const width = 770;
  const height = 160;

  context.save();

  context.shadowColor = "rgba(32, 32, 32, 0.18)";
  context.shadowBlur = 0;
  context.shadowOffsetX = 12;
  context.shadowOffsetY = 12;

  roundedRectPath(context, x, y, width, height, 8);
  context.fillStyle = "#fffdf2";
  context.fill();

  context.shadowColor = "transparent";
  context.lineWidth = 8;
  context.strokeStyle = "#202020";
  context.stroke();

  roundedRectPath(context, x + 12, y + 12, width - 24, height - 24, 2);
  context.lineWidth = 5;
  context.strokeStyle = theme.secondary;
  context.stroke();

  context.fillStyle = theme.accent;
  context.fillRect(x + 32, y + 37, 14, 14);

  context.fillStyle = "#202020";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.font = `900 34px ${STORY_FONT}`;
  context.fillText("A memory was caught!", x + 68, y + 64);

  context.fillStyle = "#5d5a55";
  context.font = `700 23px ${STORY_FONT}`;
  context.fillText(
    "Share your PokeFrame with your party.",
    x + 68,
    y + 109
  );

  context.restore();
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

  const createSocialStoryCanvas = async () => {
    const cardCanvas = await createCardCanvas();
    const primaryLogo = await loadImage(smoraPrimary);
    const canvas = document.createElement("canvas");

    canvas.width = STORY_WIDTH;
    canvas.height = STORY_HEIGHT;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create PokeFrame story canvas.");
    }

    const theme =
      STORY_THEMES[currentFrame.id] ||
      STORY_THEMES.electric;

    context.fillStyle = "#f4e8b9";
    context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    drawPixelGrid(context);

    const backgroundGlow = context.createRadialGradient(
      STORY_WIDTH / 2,
      880,
      100,
      STORY_WIDTH / 2,
      880,
      880
    );
    backgroundGlow.addColorStop(0, "rgba(255, 255, 255, 0.72)");
    backgroundGlow.addColorStop(1, "rgba(255, 255, 255, 0)");

    context.fillStyle = backgroundGlow;
    context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    context.save();
    context.globalAlpha = 0.1;
    context.fillStyle = theme.secondary;

    context.beginPath();
    context.arc(-30, 680, 230, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.arc(1110, 1080, 280, 0, Math.PI * 2);
    context.fill();

    context.restore();

    const logoMaxWidth = 460;
    const logoScale = Math.min(
      logoMaxWidth / primaryLogo.width,
      1
    );
    const logoWidth = primaryLogo.width * logoScale;
    const logoHeight = primaryLogo.height * logoScale;
    const logoX = (STORY_WIDTH - logoWidth) / 2;

    context.drawImage(
      primaryLogo,
      logoX,
      64,
      logoWidth,
      logoHeight
    );

    context.textAlign = "center";
    context.textBaseline = "alphabetic";

    context.fillStyle = theme.accentDark;
    context.font = `900 25px ${STORY_FONT}`;
    context.fillText(
      "SMORA · POKEFRAME",
      STORY_WIDTH / 2,
      278
    );

    context.fillStyle = "#202020";
    context.font = `900 48px ${STORY_FONT}`;
    context.fillText(
      "MEMORY CAUGHT!",
      STORY_WIDTH / 2,
      338
    );

    context.fillStyle = "#5d5a55";
    context.font = `700 20px ${STORY_FONT}`;
    context.fillText(
      `${currentFrame.label.toUpperCase()} TYPE`,
      STORY_WIDTH / 2,
      378
    );

    drawPixelSparkle(context, 170, 295, 52, theme.highlight);
    drawPixelSparkle(context, 915, 318, 40, theme.secondary);
    drawPixelBall(context, 916, 530, 88, 0.16);
    drawPixelBall(context, 155, 1030, 66, -0.18);

    drawElectricChibi(context, 152, 515, 1.72);
    drawGrassChibi(context, 904, 760, 1.58);
    drawFireChibi(context, 145, 1228, 1.55);

    const cardMaxWidth = 520;
    const cardMaxHeight = 790;
    const cardScale = Math.min(
      cardMaxWidth / cardCanvas.width,
      cardMaxHeight / cardCanvas.height
    );
    const cardWidth = cardCanvas.width * cardScale;
    const cardHeight = cardCanvas.height * cardScale;
    const cardCenterX = STORY_WIDTH / 2;
    const cardCenterY = 850;
    const cardRotation = -0.022;

    context.save();
    context.translate(cardCenterX, cardCenterY);
    context.rotate(cardRotation);

    context.shadowColor = "rgba(32, 32, 32, 0.25)";
    context.shadowBlur = 35;
    context.shadowOffsetX = 10;
    context.shadowOffsetY = 24;

    roundedRectPath(
      context,
      -cardWidth / 2 - 12,
      -cardHeight / 2 - 12,
      cardWidth + 24,
      cardHeight + 24,
      24
    );
    context.fillStyle = "#fffdf2";
    context.fill();

    context.shadowColor = "transparent";

    roundedRectPath(
      context,
      -cardWidth / 2 - 12,
      -cardHeight / 2 - 12,
      cardWidth + 24,
      cardHeight + 24,
      24
    );
    context.lineWidth = 7;
    context.strokeStyle = "#202020";
    context.stroke();

    context.drawImage(
      cardCanvas,
      -cardWidth / 2,
      -cardHeight / 2,
      cardWidth,
      cardHeight
    );

    context.restore();

    drawStoryDialogue(context, theme);

    drawPixelSparkle(context, 868, 1255, 58, theme.highlight);
    drawPixelSparkle(context, 237, 1575, 42, theme.secondary);

    const pillWidth = 610;
    const pillHeight = 90;
    const pillX = (STORY_WIDTH - pillWidth) / 2;
    const pillY = 1650;

    context.save();
    context.shadowColor = "rgba(32, 32, 32, 0.14)";
    context.shadowBlur = 0;
    context.shadowOffsetX = 7;
    context.shadowOffsetY = 7;

    roundedRectPath(
      context,
      pillX,
      pillY,
      pillWidth,
      pillHeight,
      10
    );
    context.fillStyle = theme.highlight;
    context.fill();

    context.shadowColor = "transparent";
    context.lineWidth = 6;
    context.strokeStyle = "#202020";
    context.stroke();

    context.fillStyle = "#202020";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `900 27px ${STORY_FONT}`;
    context.fillText(
      "smora-photobooth.vercel.app",
      STORY_WIDTH / 2,
      pillY + pillHeight / 2 + 2
    );

    context.restore();

    context.fillStyle = "#5d5a55";
    context.textAlign = "center";
    context.textBaseline = "alphabetic";
    context.font = `700 17px ${STORY_FONT}`;
    context.fillText(
      "SNAP · CATCH · SHARE YOUR MEMORY",
      STORY_WIDTH / 2,
      1810
    );

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
      const canvas = await createSocialStoryCanvas();
      const blob = await canvasToBlob(canvas);
      const file = new File(
        [blob],
        `smora-pokeframe-story-${Date.now()}.png`,
        {
          type: "image/png",
        }
      );

      const canShareFile =
        typeof navigator.share === "function" &&
        (typeof navigator.canShare !== "function" ||
          navigator.canShare({
            files: [file],
          }));

      if (canShareFile) {
        await navigator.share({
          title: "My Smora PokeFrame Story",
          text: "Made with Smora — Smile with Memories.",
          files: [file],
        });
      } else {
        downloadCanvas(canvas, file.name);
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error(
          "Unable to share PokeFrame story:",
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

      <div className="poke-output-pixel-grid" aria-hidden="true" />

      <div className="poke-chibi-world" aria-hidden="true">

        <div className="poke-chibi-runner poke-chibi-runner-pika">

          <div className="poke-chibi poke-chibi-pika">

            <span className="poke-chibi-ear poke-chibi-ear-left" />

            <span className="poke-chibi-ear poke-chibi-ear-right" />

            <span className="poke-chibi-face">

              <span className="poke-chibi-eye poke-chibi-eye-left" />

              <span className="poke-chibi-eye poke-chibi-eye-right" />

              <span className="poke-chibi-cheek poke-chibi-cheek-left" />

              <span className="poke-chibi-cheek poke-chibi-cheek-right" />

            </span>

            <span className="poke-chibi-tail poke-chibi-tail-zap" />

            <span className="poke-chibi-feet" />

          </div>

        </div>

        <div className="poke-chibi-runner poke-chibi-runner-bulb">

          <div className="poke-chibi poke-chibi-bulb">

            <span className="poke-chibi-bulb-back" />

            <span className="poke-chibi-ear poke-chibi-ear-left" />

            <span className="poke-chibi-ear poke-chibi-ear-right" />

            <span className="poke-chibi-face">

              <span className="poke-chibi-eye poke-chibi-eye-left" />

              <span className="poke-chibi-eye poke-chibi-eye-right" />

              <span className="poke-chibi-smile" />

            </span>

            <span className="poke-chibi-feet" />

          </div>

        </div>

        <div className="poke-chibi-runner poke-chibi-runner-fire">

          <div className="poke-chibi poke-chibi-fire">

            <span className="poke-chibi-face">

              <span className="poke-chibi-eye poke-chibi-eye-left" />

              <span className="poke-chibi-eye poke-chibi-eye-right" />

              <span className="poke-chibi-smile" />

            </span>

            <span className="poke-chibi-tail poke-chibi-tail-fire" />

            <span className="poke-chibi-feet" />

          </div>

        </div>

      </div>

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

              <div className="poke-card-float-stage">

                <span className="poke-card-pixel-spark poke-card-pixel-spark-one" />

                <span className="poke-card-pixel-spark poke-card-pixel-spark-two" />

                <span className="poke-card-pixel-spark poke-card-pixel-spark-three" />

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

                <span className="poke-card-floating-shadow" />

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

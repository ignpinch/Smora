import { useMemo, useState } from "react";
import "./solo_output.css";
import smoraPrimary from "../../../assets/smora-primary.png";

const TOTAL_SHOTS = 4;

const FONT_OPTIONS = [
  {
    id: "clean",
    css: '"Avenir Next", "Trebuchet MS", "Segoe UI", sans-serif',
    canvas: 'Arial',
  },
  {
    id: "serif",
    css: 'Georgia, "Times New Roman", serif',
    canvas: 'Georgia',
  },
  {
    id: "mono",
    css: '"Courier New", Courier, monospace',
    canvas: '"Courier New"',
  },
  {
    id: "soft",
    css: '"Comic Sans MS", "Segoe Print", cursive',
    canvas: '"Comic Sans MS"',
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

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function FontIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 5h14" />
      <path d="M12 5v14" />
      <path d="M8 19h8" />
    </svg>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}) {
  return (
    <button
      type="button"
      className={`output-toggle ${
        checked ? "active" : ""
      }`}
      onClick={() => onChange(!checked)}
      aria-label={label}
      aria-pressed={checked}
    >
      <span />
    </button>
  );
}

function SettingRow({
  icon,
  title,
  checked,
  onChange,
  children,
}) {
  return (
    <div className="setting-row">
      <div className="setting-row-main">
        <div className="setting-label">
          <div className="setting-icon">
            {icon}
          </div>

          <strong>
            {title}
          </strong>
        </div>

        <Toggle
          checked={checked}
          onChange={onChange}
          label={title}
        />
      </div>

      {children}
    </div>
  );
}

function FontSelector({
  selectedFont,
  onSelect,
}) {
  return (
    <div className="font-setting">
      <div className="font-setting-title">
        <div className="setting-icon">
          <FontIcon />
        </div>

        <strong>
          Font
        </strong>
      </div>

      <div className="font-options">
        {FONT_OPTIONS.map((font) => (
          <button
            key={font.id}
            type="button"
            className={`font-option ${
              selectedFont === font.id
                ? "active"
                : ""
            }`}
            style={{
              fontFamily: font.css,
            }}
            onClick={() =>
              onSelect(font.id)
            }
            aria-label={`Select ${font.id} font`}
          >
            Aa
          </button>
        ))}
      </div>
    </div>
  );
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

function canvasToBlob(
  canvas,
  type = "image/png",
  quality = 0.96
) {
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
              "Could not create image."
            )
          );
        },
        type,
        quality
      );
    }
  );
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date =
    new Date(
      `${dateValue}T00:00:00`
    );

  return new Intl.DateTimeFormat(
    "en",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
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
    image.width /
    image.height;

  const targetRatio =
    width /
    height;

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
}


function roundedRectPath(
  context,
  x,
  y,
  width,
  height,
  radius
) {
  const safeRadius =
    Math.min(
      radius,
      width / 2,
      height / 2
    );

  context.beginPath();
  context.moveTo(
    x + safeRadius,
    y
  );
  context.lineTo(
    x + width - safeRadius,
    y
  );
  context.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + safeRadius
  );
  context.lineTo(
    x + width,
    y + height - safeRadius
  );
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height
  );
  context.lineTo(
    x + safeRadius,
    y + height
  );
  context.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - safeRadius
  );
  context.lineTo(
    x,
    y + safeRadius
  );
  context.quadraticCurveTo(
    x,
    y,
    x + safeRadius,
    y
  );
  context.closePath();
}

function drawStoryBlob(
  context,
  x,
  y,
  radius,
  color
) {
  const gradient =
    context.createRadialGradient(
      x - radius * 0.35,
      y - radius * 0.38,
      radius * 0.08,
      x,
      y,
      radius
    );

  gradient.addColorStop(
    0,
    "#fff4b8"
  );

  gradient.addColorStop(
    0.28,
    color
  );

  gradient.addColorStop(
    1,
    "#e7a600"
  );

  context.fillStyle =
    gradient;

  context.beginPath();
  context.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2
  );
  context.fill();

  context.save();
  context.globalAlpha =
    0.5;

  context.fillStyle =
    "#ffffff";

  context.beginPath();
  context.ellipse(
    x - radius * 0.38,
    y - radius * 0.42,
    radius * 0.23,
    radius * 0.09,
    -0.7,
    0,
    Math.PI * 2
  );
  context.fill();

  context.restore();
}

function drawHeartDoodle(
  context,
  x,
  y,
  size,
  color,
  rotation = 0
) {
  context.save();

  context.translate(
    x,
    y
  );

  context.rotate(
    rotation
  );

  context.strokeStyle =
    color;

  context.lineWidth =
    Math.max(
      7,
      size * 0.08
    );

  context.lineCap =
    "round";

  context.lineJoin =
    "round";

  context.beginPath();

  context.moveTo(
    0,
    size * 0.24
  );

  context.bezierCurveTo(
    -size * 0.55,
    -size * 0.18,
    -size * 0.62,
    size * 0.42,
    0,
    size
  );

  context.bezierCurveTo(
    size * 0.62,
    size * 0.42,
    size * 0.55,
    -size * 0.18,
    0,
    size * 0.24
  );

  context.stroke();
  context.restore();
}

function drawImageWithRoundedCorners(
  context,
  image,
  x,
  y,
  width,
  height,
  radius
) {
  context.save();

  roundedRectPath(
    context,
    x,
    y,
    width,
    height,
    radius
  );

  context.clip();

  context.drawImage(
    image,
    x,
    y,
    width,
    height
  );

  context.restore();
}

function drawStripBackground(
  context,
  strip,
  width,
  height
) {
  const colors = {
    cream: "#fff9f0",
    clean: "#ffffff",
    black: "#2e2e2e",
    film: "#e9e0d2",
    yellow: "#ffc629",
    coral: "#ff7b7b",
    sky: "#a5dcff",
    mint: "#b5ebc8",
  };

  context.fillStyle =
    colors[strip] ||
    "#fff9f0";

  context.fillRect(
    0,
    0,
    width,
    height
  );

  if (
    strip ===
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
        const alternate =
          (Math.floor(
            x / size
          ) +
            Math.floor(
              y / size
            )) %
          2;

        context.fillStyle =
          alternate
            ? "#fff9f0"
            : "#ffc629";

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
    strip === "dots"
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
      let y = 15;
      y < height;
      y += 30
    ) {
      for (
        let x = 15;
        x < width;
        x += 30
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
    strip === "retro"
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
    strip === "smile"
  ) {
    context.fillStyle =
      "#fff9f0";

    context.fillRect(
      0,
      0,
      width,
      height
    );

    const circles = [
      [
        55,
        65,
        22,
        "#ffc629",
      ],
      [
        width - 62,
        120,
        18,
        "#ff7b7b",
      ],
      [
        55,
        height - 250,
        15,
        "#ff7b7b",
      ],
      [
        width - 52,
        height - 90,
        19,
        "#ffc629",
      ],
    ];

    circles.forEach(
      ([
        x,
        y,
        radius,
        color,
      ]) => {
        context.beginPath();

        context.fillStyle =
          color;

        context.arc(
          x,
          y,
          radius,
          0,
          Math.PI * 2
        );

        context.fill();
      }
    );
  }

  return strip ===
    "black"
    ? "#ffffff"
    : "#2e2e2e";
}

export default function SoloOutput({
  shots = [],
  selectedStrip = "cream",
  onBack,
  onStartOver,
}) {
  const today =
    useMemo(() => {
      const now =
        new Date();

      const year =
        now.getFullYear();

      const month =
        String(
          now.getMonth() + 1
        ).padStart(
          2,
          "0"
        );

      const day =
        String(
          now.getDate()
        ).padStart(
          2,
          "0"
        );

      return `${year}-${month}-${day}`;
    }, []);

  const [
    showImage,
    setShowImage,
  ] = useState(true);

  const [
    showText,
    setShowText,
  ] = useState(false);

  const [
    showDate,
    setShowDate,
  ] = useState(true);

  const [
    customText,
    setCustomText,
  ] = useState("");

  const [
    dateValue,
    setDateValue,
  ] = useState(today);

  const [
    selectedFont,
    setSelectedFont,
  ] = useState("clean");

  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false);

  const [
    isSharing,
    setIsSharing,
  ] = useState(false);

  const [
    shareMessage,
    setShareMessage,
  ] = useState("");

  const [
    showMobileCustomize,
    setShowMobileCustomize,
  ] = useState(false);

  const complete =
    shots.length ===
    TOTAL_SHOTS;

  const displayDate =
    formatDate(
      dateValue
    );

  const currentFont =
    FONT_OPTIONS.find(
      (font) =>
        font.id ===
        selectedFont
    ) ||
    FONT_OPTIONS[0];

  const showFontOptions =
    showText ||
    showDate;

  const createStripCanvas =
    async () => {
      const images =
        await Promise.all(
          shots
            .slice(
              0,
              TOTAL_SHOTS
            )
            .map(
              (shot) =>
                loadImage(
                  shot
                )
            )
        );

      const markImage =
        showImage
          ? await loadImage(
              smoraPrimary
            )
          : null;

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        600;

      const padding =
        28;

      const gap =
        14;

      const footerHeight =
        150;

      const photoWidth =
        canvas.width -
        padding * 2;

      const photoHeight =
        photoWidth * 0.75;

      canvas.height =
        padding * 2 +
        photoHeight *
          TOTAL_SHOTS +
        gap *
          (TOTAL_SHOTS - 1) +
        footerHeight;

      const context =
        canvas.getContext(
          "2d"
        );

      const textColor =
        drawStripBackground(
          context,
          selectedStrip,
          canvas.width,
          canvas.height
        );

      images.forEach(
        (
          image,
          index
        ) => {
          const y =
            padding +
            index *
              (photoHeight +
                gap);

          context.save();

          roundedRectPath(
            context,
            padding,
            y,
            photoWidth,
            photoHeight,
            10
          );

          context.clip();

          drawCoverImage(
            context,
            image,
            padding,
            y,
            photoWidth,
            photoHeight
          );

          context.restore();
        }
      );

      context.fillStyle =
        textColor;

      context.textAlign =
        "left";

      const footerLeft =
        32;

      const footerBottom =
        canvas.height -
        28;

      let currentY =
        footerBottom;

      if (
        showDate &&
        displayDate
      ) {
        context.globalAlpha =
          0.62;

        context.font =
          `500 18px ${currentFont.canvas}`;

        context.fillText(
          displayDate,
          footerLeft,
          currentY
        );

        context.globalAlpha =
          1;

        currentY -=
          34;
      }

      if (
        showText &&
        customText.trim()
      ) {
        context.font =
          `700 24px ${currentFont.canvas}`;

        context.fillText(
          customText.trim(),
          footerLeft,
          currentY
        );

        currentY -=
          44;
      }

      if (
        showImage &&
        markImage
      ) {
        const markWidth =
          58;

        const markHeight =
          markImage.height *
          (markWidth /
            markImage.width);

        context.drawImage(
          markImage,
          footerLeft,
          currentY -
            markHeight,
          markWidth,
          markHeight
        );
      }

      return canvas;
    };

    const createSocialStoryCanvas =
    async () => {
      const stripCanvas =
        await createStripCanvas();

      const primaryLogo =
        await loadImage(
          smoraPrimary
        );

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        1080;

      canvas.height =
        1920;

      const context =
        canvas.getContext(
          "2d"
        );

      context.fillStyle =
        "#fff9f0";

      context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const glow =
        context.createRadialGradient(
          540,
          900,
          80,
          540,
          900,
          1100
        );

      glow.addColorStop(
        0,
        "rgba(255,255,255,0.72)"
      );

      glow.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      context.fillStyle =
        glow;

      context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      drawStoryBlob(
        context,
        -90,
        650,
        245,
        "#ffc629"
      );

      drawStoryBlob(
        context,
        1115,
        1700,
        300,
        "#ffc629"
      );

      context.save();

      context.globalAlpha =
        0.16;

      context.fillStyle =
        "#f1dfbe";

      context.beginPath();

      context.arc(
        1015,
        545,
        145,
        0,
        Math.PI * 2
      );

      context.fill();

      context.beginPath();

      context.arc(
        70,
        1790,
        165,
        0,
        Math.PI * 2
      );

      context.fill();

      context.restore();

      const logoMaxWidth =
        680;

      const logoScale =
        Math.min(
          logoMaxWidth /
            primaryLogo.width,
          1
        );

      const logoWidth =
        primaryLogo.width *
        logoScale;

      const logoHeight =
        primaryLogo.height *
        logoScale;

      const logoX =
        (canvas.width -
          logoWidth) /
        2;

      const logoY =
        76;

      context.drawImage(
        primaryLogo,
        logoX,
        logoY,
        logoWidth,
        logoHeight
      );

      context.fillStyle =
        "#2e2e2e";

      context.textAlign =
        "center";

      context.font =
        '600 33px "Arial"';

      context.fillText(
        "Smile with Memories",
        canvas.width / 2,
        330
      );

      context.strokeStyle =
        "#ffc629";

      context.lineWidth =
        11;

      context.lineCap =
        "round";

      context.beginPath();

      context.moveTo(
        208,
        318
      );

      context.lineTo(
        235,
        306
      );

      context.moveTo(
        244,
        348
      );

      context.lineTo(
        275,
        336
      );

      context.stroke();

      context.beginPath();

      context.moveTo(
        845,
        306
      );

      context.lineTo(
        874,
        318
      );

      context.moveTo(
        806,
        336
      );

      context.lineTo(
        836,
        348
      );

      context.stroke();

      drawHeartDoodle(
        context,
        805,
        525,
        64,
        "#ff715f",
        0.08
      );

      drawHeartDoodle(
        context,
        245,
        1215,
        60,
        "#ff715f",
        -0.08
      );

      context.strokeStyle =
        "#ffc629";

      context.lineWidth =
        10;

      context.lineCap =
        "round";

      context.beginPath();

      context.moveTo(
        220,
        715
      );

      context.lineTo(
        170,
        680
      );

      context.moveTo(
        247,
        687
      );

      context.lineTo(
        217,
        635
      );

      context.stroke();

      context.beginPath();

      context.moveTo(
        805,
        1085
      );

      context.bezierCurveTo(
        842,
        1000,
        910,
        1015,
        944,
        970
      );

      context.bezierCurveTo(
        980,
        925,
        1035,
        949,
        1008,
        996
      );

      context.stroke();

      const maxStripWidth =
        398;

      const maxStripHeight =
        1180;

      const scale =
        Math.min(
          maxStripWidth /
            stripCanvas.width,
          maxStripHeight /
            stripCanvas.height
        );

      const stripWidth =
        stripCanvas.width *
        scale;

      const stripHeight =
        stripCanvas.height *
        scale;

      const centerX =
        canvas.width / 2;

      const stripCenterY =
        1000;

      const rotation =
        -0.035;

      const stripRadius =
        28;

      context.save();

      context.translate(
        centerX,
        stripCenterY
      );

      context.rotate(
        rotation
      );

      context.shadowColor =
        "rgba(46,46,46,0.18)";

      context.shadowBlur =
        32;

      context.shadowOffsetY =
        18;

      roundedRectPath(
        context,
        -stripWidth / 2,
        -stripHeight / 2,
        stripWidth,
        stripHeight,
        stripRadius
      );

      context.fillStyle =
        "#fffdf8";

      context.fill();

      context.restore();

      context.save();

      context.translate(
        centerX,
        stripCenterY
      );

      context.rotate(
        rotation
      );

      roundedRectPath(
        context,
        -stripWidth / 2,
        -stripHeight / 2,
        stripWidth,
        stripHeight,
        stripRadius
      );

      context.clip();

      context.drawImage(
        stripCanvas,
        -stripWidth / 2,
        -stripHeight / 2,
        stripWidth,
        stripHeight
      );

      context.restore();

      const pillWidth =
        500;

      const pillHeight =
        86;

      const pillX =
        (canvas.width -
          pillWidth) /
        2;

      const pillY =
        1710;

      const pillGradient =
        context.createLinearGradient(
          pillX,
          pillY,
          pillX +
            pillWidth,
          pillY
        );

      pillGradient.addColorStop(
        0,
        "#fff1b0"
      );

      pillGradient.addColorStop(
        0.5,
        "#ffe694"
      );

      pillGradient.addColorStop(
        1,
        "#fff1b0"
      );

      roundedRectPath(
        context,
        pillX,
        pillY,
        pillWidth,
        pillHeight,
        pillHeight / 2
      );

      context.fillStyle =
        pillGradient;

      context.fill();

      context.fillStyle =
        "#2e2e2e";

      context.textAlign =
        "center";

      context.font =
        '600 31px "Arial"';

      context.fillText(
        "smora-photobooth.vercel.app",
        canvas.width / 2,
        pillY + 55
      );

      context.strokeStyle =
        "#ffc629";

      context.lineWidth =
        10;

      context.lineCap =
        "round";

      const rays = [
        [-300, 17, -332, 1],
        [-292, 50, -325, 65],
        [300, 17, 332, 1],
        [292, 50, 325, 65],
      ];

      rays.forEach(
        ([
          x1,
          y1,
          x2,
          y2,
        ]) => {
          context.beginPath();

          context.moveTo(
            canvas.width / 2 +
              x1,
            pillY + y1
          );

          context.lineTo(
            canvas.width / 2 +
              x2,
            pillY + y2
          );

          context.stroke();
        }
      );

      return canvas;
    };

  const handleDownload =
    async () => {
      if (
        !complete ||
        isDownloading
      ) {
        return;
      }

      setIsDownloading(
        true
      );

      try {
        const canvas =
          await createStripCanvas();

        const link =
          document.createElement(
            "a"
          );

        link.download =
          `smora-${Date.now()}.jpg`;

        link.href =
          canvas.toDataURL(
            "image/jpeg",
            0.96
          );

        link.click();
      } finally {
        setIsDownloading(
          false
        );
      }
    };

  const handleShare =
    async () => {
      if (
        !complete ||
        isSharing
      ) {
        return;
      }

      setIsSharing(
        true
      );

      setShareMessage(
        ""
      );

      try {
        const storyCanvas =
          await createSocialStoryCanvas();

        const blob =
          await canvasToBlob(
            storyCanvas,
            "image/png"
          );

        const file =
          new File(
            [blob],
            `smora-story-${Date.now()}.png`,
            {
              type:
                "image/png",
            }
          );

        const canShareFiles =
          Boolean(
            navigator.share &&
              navigator.canShare &&
              navigator.canShare({
                files: [
                  file,
                ],
              })
          );

        if (
          canShareFiles
        ) {
          setShareMessage(
            "Choose where you want to share it."
          );

          await navigator.share({
            files: [
              file,
            ],
            title:
              "Smora Story",
          });

          setShareMessage(
            ""
          );

          return;
        }

        const link =
          document.createElement(
            "a"
          );

        link.download =
          `smora-story-${Date.now()}.png`;

        link.href =
          storyCanvas.toDataURL(
            "image/png"
          );

        link.click();

        setShareMessage(
          "Story image downloaded. You can now share it to Instagram, Facebook, Messenger, TikTok, or another app."
        );
      } catch (
        error
      ) {
        if (
          error?.name !==
          "AbortError"
        ) {
          setShareMessage(
            "Sharing is not supported here. Try from your phone or download the Story image."
          );
        }
      } finally {
        setIsSharing(
          false
        );
      }
    };

  const settings = (
    <div className="settings-content">
      <SettingRow
        icon={
          <img
            src={smoraPrimary}
            alt=""
            className="setting-smora-primary"
          />
        }
        title="Logo"
        checked={showImage}
        onChange={setShowImage}
      />

      <SettingRow
        icon={<TextIcon />}
        title="Text"
        checked={showText}
        onChange={setShowText}
      >
        {showText && (
          <div className="output-field">
            <input
              type="text"
              value={customText}
              maxLength={14}
              placeholder="Initials"
              onChange={(
                event
              ) =>
                setCustomText(
                  event.target
                    .value
                )
              }
            />
          </div>
        )}
      </SettingRow>

      <SettingRow
        icon={
          <CalendarIcon />
        }
        title="Date"
        checked={showDate}
        onChange={setShowDate}
      >
        {showDate && (
          <div className="output-field">
            <input
              type="date"
              value={dateValue}
              onChange={(
                event
              ) =>
                setDateValue(
                  event.target
                    .value
                )
              }
            />
          </div>
        )}
      </SettingRow>

      {showFontOptions && (
        <FontSelector
          selectedFont={
            selectedFont
          }
          onSelect={
            setSelectedFont
          }
        />
      )}
    </div>
  );

  return (
    <div className="solo-output-page">
      <main className="solo-output-container">
        <header className="solo-output-header">
          <button
            type="button"
            className="output-back-button"
            onClick={onBack}
          >
            <ArrowLeftIcon />
            <span>
              Back
            </span>
          </button>

          <div className="output-current-step">
            <span>
              Step 5
            </span>

            <strong>
              Final Output
            </strong>
          </div>

          <div className="output-ready-state">
            <span>
              Ready
            </span>

            <strong>
              Download
            </strong>
          </div>
        </header>

        <section className="solo-output-content">
          <div className="solo-output-layout">
            <div className="output-preview-column">
              <div className="output-mobile-toolbar">
                <button
                  type="button"
                  className="mobile-tool-button"
                  onClick={
                    onStartOver
                  }
                  aria-label="Start over"
                >
                  <RefreshIcon />
                </button>

                <button
                  type="button"
                  className="mobile-tool-button mobile-download-tool"
                  disabled={
                    !complete ||
                    isDownloading
                  }
                  onClick={
                    handleDownload
                  }
                  aria-label="Download"
                >
                  <DownloadIcon />
                </button>

                <button
                  type="button"
                  className="mobile-tool-button mobile-share-tool"
                  disabled={
                    !complete ||
                    isSharing
                  }
                  onClick={
                    handleShare
                  }
                  aria-label="Share"
                >
                  <ShareIcon />
                </button>

                <button
                  type="button"
                  className="mobile-customize-button"
                  onClick={() =>
                    setShowMobileCustomize(
                      true
                    )
                  }
                >
                  <EditIcon />

                  <span>
                    Customize
                  </span>
                </button>
              </div>

              {shareMessage && (
                <p className="output-share-message output-share-message-mobile">
                  {
                    shareMessage
                  }
                </p>
              )}

              <div
                className={`output-photo-strip strip-${selectedStrip}`}
              >
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

                    return (
                      <div
                        className="output-photo-frame"
                        key={
                          index
                        }
                      >
                        {shot ? (
                          <img
                            src={
                              shot
                            }
                            alt={`Photobooth shot ${
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

                <div className="output-strip-footer">
                  <div className="output-strip-details">
                    {showImage && (
                      <img
                        src={
                          smoraPrimary
                        }
                        alt="Smora"
                        className="output-strip-logo"
                      />
                    )}

                    {showText &&
                      customText.trim() && (
                        <span
                          className="output-strip-custom-text"
                          style={{
                            fontFamily:
                              currentFont.css,
                          }}
                        >
                          {customText.trim()}
                        </span>
                      )}

                    {showDate &&
                      displayDate && (
                        <small
                          className="output-strip-date"
                          style={{
                            fontFamily:
                              currentFont.css,
                          }}
                        >
                          {
                            displayDate
                          }
                        </small>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <aside className="output-edit-panel">
              <div className="output-panel-header">
                <div className="output-panel-header-icon">
                  <EditIcon />
                </div>

                <h2>
                  Customize
                </h2>
              </div>

              {settings}

              <div className="output-actions">
                <button
                  type="button"
                  className="output-download-button"
                  disabled={
                    !complete ||
                    isDownloading
                  }
                  onClick={
                    handleDownload
                  }
                >
                  <DownloadIcon />

                  <span>
                    {isDownloading
                      ? "Preparing..."
                      : "Download"}
                  </span>
                </button>

                <button
                  type="button"
                  className="output-share-button"
                  disabled={
                    !complete ||
                    isSharing
                  }
                  onClick={
                    handleShare
                  }
                >
                  <ShareIcon />

                  <span>
                    {isSharing
                      ? "Preparing..."
                      : "Share"}
                  </span>
                </button>

                {shareMessage && (
                  <p className="output-share-message">
                    {
                      shareMessage
                    }
                  </p>
                )}

                <button
                  type="button"
                  className="output-start-over-button"
                  onClick={
                    onStartOver
                  }
                >
                  <RefreshIcon />

                  <span>
                    Start over
                  </span>
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {showMobileCustomize && (
        <div className="mobile-customize-overlay">
          <div
            className="mobile-customize-panel"
            role="dialog"
            aria-modal="true"
          >
            <div className="mobile-customize-header">
              <div className="mobile-customize-header-icon">
                <EditIcon />
              </div>

              <h2>
                Customize
              </h2>
            </div>

            {settings}

            <button
              type="button"
              className="mobile-customize-okay"
              onClick={() =>
                setShowMobileCustomize(
                  false
                )
              }
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
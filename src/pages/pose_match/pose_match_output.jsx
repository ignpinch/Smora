import {
  useMemo,
  useState,
} from "react";
import "./pose_match_output.css";
import smoraMark from "../../assets/smora-mark.png";
import smoraPrimary from "../../assets/smora-primary.png";

const TOTAL_SHOTS = 4;

const FONT_OPTIONS = [
  {
    id: "clean",
    css: '"Avenir Next", "Trebuchet MS", "Segoe UI", sans-serif',
    canvas: "Arial",
  },
  {
    id: "serif",
    css: 'Georgia, "Times New Roman", serif',
    canvas: "Georgia",
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
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
      />

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
      className={`pose-output-toggle ${
        checked
          ? "active"
          : ""
      }`}
      onClick={() =>
        onChange(
          !checked
        )
      }
      aria-label={
        label
      }
      aria-pressed={
        checked
      }
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
    <div className="pose-output-setting-row">
      <div className="pose-output-setting-main">
        <div className="pose-output-setting-label">
          <div className="pose-output-setting-icon">
            {icon}
          </div>

          <strong>
            {title}
          </strong>
        </div>

        <Toggle
          checked={
            checked
          }
          onChange={
            onChange
          }
          label={
            title
          }
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
    <div className="pose-output-font-setting">
      <div className="pose-output-font-title">
        <div className="pose-output-setting-icon">
          <FontIcon />
        </div>

        <strong>
          Font
        </strong>
      </div>

      <div className="pose-output-font-options">
        {FONT_OPTIONS.map(
          (
            font
          ) => (
            <button
              key={
                font.id
              }
              type="button"
              className={`pose-output-font-option ${
                selectedFont ===
                font.id
                  ? "active"
                  : ""
              }`}
              style={{
                fontFamily:
                  font.css,
              }}
              onClick={() =>
                onSelect(
                  font.id
                )
              }
            >
              Aa
            </button>
          )
        )}
      </div>
    </div>
  );
}

function loadImage(source) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const image =
        new Image();

      image.onload =
        () =>
          resolve(
            image
          );

      image.onerror =
        reject;

      image.src =
        source;
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

function formatDate(
  dateValue
) {
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
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",
    }
  ).format(
    date
  );
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

  let sourceX =
    0;

  let sourceY =
    0;

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

function drawStripBackground(
  context,
  strip,
  width,
  height
) {
  const colors = {
    cream:
      "#fff9f0",

    clean:
      "#ffffff",

    black:
      "#2e2e2e",

    yellow:
      "#ffc629",

    coral:
      "#ff7b7b",

    sky:
      "#a5dcff",

    mint:
      "#b5ebc8",
  };

  context.fillStyle =
    colors[
      strip
    ] ||
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
    const size =
      38;

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
            x /
              size
          ) +
            Math.floor(
              y /
                size
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

  return strip ===
    "black"
    ? "#ffffff"
    : "#2e2e2e";
}

function getPoseSource(
  pose
) {
  if (!pose) {
    return null;
  }

  if (
    typeof pose ===
    "string"
  ) {
    return pose;
  }

  return (
    pose.image ||
    pose.src ||
    null
  );
}

export default function PoseMatchOutput({
  shots = [],
  selectedPoses = [],
  selectedStrip = "cream",
  onBack,
  onStartOver,
}) {
  const today =
    useMemo(
      () => {
        const now =
          new Date();

        const year =
          now.getFullYear();

        const month =
          String(
            now.getMonth() +
              1
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
      },
      []
    );

  const [
    showImage,
    setShowImage,
  ] = useState(
    true
  );

  const [
    showText,
    setShowText,
  ] = useState(
    false
  );

  const [
    showDate,
    setShowDate,
  ] = useState(
    true
  );

  const [
    customText,
    setCustomText,
  ] = useState(
    ""
  );

  const [
    dateValue,
    setDateValue,
  ] = useState(
    today
  );

  const [
    selectedFont,
    setSelectedFont,
  ] = useState(
    "clean"
  );

  const [
    isDownloading,
    setIsDownloading,
  ] = useState(
    false
  );

  const [
    isSharing,
    setIsSharing,
  ] = useState(
    false
  );

  const [
    shareMessage,
    setShareMessage,
  ] = useState(
    ""
  );

  const [
    showMobileCustomize,
    setShowMobileCustomize,
  ] = useState(
    false
  );

  const complete =
    shots.length ===
      TOTAL_SHOTS &&
    selectedPoses.length >=
      TOTAL_SHOTS;

  const displayDate =
    formatDate(
      dateValue
    );

  const currentFont =
    FONT_OPTIONS.find(
      (
        font
      ) =>
        font.id ===
        selectedFont
    ) ||
    FONT_OPTIONS[0];

  const showFontOptions =
    showText ||
    showDate;

  const createPoseStripCanvas =
    async () => {
      const shotImages =
        await Promise.all(
          shots
            .slice(
              0,
              TOTAL_SHOTS
            )
            .map(
              (
                shot
              ) =>
                loadImage(
                  shot
                )
            )
        );

      const referenceImages =
        await Promise.all(
          selectedPoses
            .slice(
              0,
              TOTAL_SHOTS
            )
            .map(
              (
                pose
              ) =>
                loadImage(
                  getPoseSource(
                    pose
                  )
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
        1200;

      const padding =
        38;

      const columnGap =
        18;

      const rowGap =
        18;

      const footerHeight =
        220;

      const contentWidth =
        canvas.width -
        padding * 2;

      const cellWidth =
        (contentWidth -
          columnGap) /
        2;

      const cellHeight =
        cellWidth *
        0.75;

      canvas.height =
        Math.round(
          padding * 2 +
            cellHeight *
              TOTAL_SHOTS +
            rowGap *
              (TOTAL_SHOTS - 1) +
            footerHeight
        );

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

      for (
        let index = 0;
        index <
        TOTAL_SHOTS;
        index += 1
      ) {
        const y =
          padding +
          index *
            (cellHeight +
              rowGap);

        const userX =
          padding;

        const referenceX =
          padding +
          cellWidth +
          columnGap;

        context.save();

        roundedRectPath(
          context,
          userX,
          y,
          cellWidth,
          cellHeight,
          14
        );

        context.clip();

        drawCoverImage(
          context,
          shotImages[
            index
          ],
          userX,
          y,
          cellWidth,
          cellHeight
        );

        context.restore();

        context.save();

        roundedRectPath(
          context,
          referenceX,
          y,
          cellWidth,
          cellHeight,
          14
        );

        context.clip();

        drawCoverImage(
          context,
          referenceImages[
            index
          ],
          referenceX,
          y,
          cellWidth,
          cellHeight
        );

        context.restore();
      }

      const footerLeft =
        46;

      const footerBottom =
        canvas.height -
        32;

      let currentY =
        footerBottom;

      context.fillStyle =
        textColor;

      context.textAlign =
        "left";

      if (
        showDate &&
        displayDate
      ) {
        context.globalAlpha =
          0.62;

        context.font =
          `500 23px ${currentFont.canvas}`;

        context.fillText(
          displayDate,
          footerLeft,
          currentY
        );

        context.globalAlpha =
          1;

        currentY -=
          44;
      }

      if (
        showText &&
        customText.trim()
      ) {
        context.font =
          `700 31px ${currentFont.canvas}`;

        context.fillText(
          customText.trim(),
          footerLeft,
          currentY
        );

        currentY -=
          54;
      }

      if (
        showImage &&
        markImage
      ) {
        const markWidth =
          150;

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
        await createPoseStripCanvas();

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
        -100,
        665,
        245,
        "#ffc629"
      );

      drawStoryBlob(
        context,
        1115,
        1695,
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
        535,
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
        72;

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
        875,
        555,
        58,
        "#ff715f",
        0.08
      );

      drawHeartDoodle(
        context,
        200,
        1240,
        58,
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
        190,
        710
      );

      context.lineTo(
        145,
        674
      );

      context.moveTo(
        220,
        682
      );

      context.lineTo(
        190,
        632
      );

      context.stroke();

      context.beginPath();

      context.moveTo(
        875,
        1130
      );

      context.bezierCurveTo(
        908,
        1050,
        965,
        1065,
        995,
        1025
      );

      context.bezierCurveTo(
        1025,
        985,
        1060,
        1008,
        1038,
        1048
      );

      context.stroke();

      const maxStripWidth =
        720;

      const maxStripHeight =
        1160;

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
        1010;

      const rotation =
        -0.02;

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
          await createPoseStripCanvas();

        const link =
          document.createElement(
            "a"
          );

        link.download =
          `smora-pose-match-${Date.now()}.jpg`;

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
            `smora-pose-match-story-${Date.now()}.png`,
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
            "Choose the social app you want to share to."
          );

          await navigator.share({
            files: [
              file,
            ],
            title:
              "Smora Pose Match",
            text:
              "Smile with Memories",
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
          `smora-pose-match-story-${Date.now()}.png`;

        link.href =
          storyCanvas.toDataURL(
            "image/png"
          );

        link.click();

        setShareMessage(
          "Story image downloaded. You can now upload it to Instagram, Facebook, Messenger, TikTok, or another app."
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
    <div className="pose-output-settings-content">
      <SettingRow
        icon={
          <img
            src={
              smoraPrimary
            }
            alt=""
            className="pose-output-setting-smora"
          />
        }
        title="Logo"
        checked={
          showImage
        }
        onChange={
          setShowImage
        }
      />

      <SettingRow
        icon={
          <TextIcon />
        }
        title="Text"
        checked={
          showText
        }
        onChange={
          setShowText
        }
      >
        {showText && (
          <div className="pose-output-field">
            <input
              type="text"
              value={
                customText
              }
              maxLength={
                14
              }
              placeholder="Initials"
              onChange={(
                event
              ) =>
                setCustomText(
                  event
                    .target
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
        checked={
          showDate
        }
        onChange={
          setShowDate
        }
      >
        {showDate && (
          <div className="pose-output-field">
            <input
              type="date"
              value={
                dateValue
              }
              onChange={(
                event
              ) =>
                setDateValue(
                  event
                    .target
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
    <div className="pose-output-page">
      <main className="pose-output-container">
        <header className="pose-output-header">
          <button
            type="button"
            className="pose-output-back"
            onClick={
              onBack
            }
          >
            <ArrowLeftIcon />

            <span>
              Back
            </span>
          </button>

          <div className="pose-output-current-step">
            <span>
              Step 6
            </span>

            <strong>
              Final Output
            </strong>
          </div>

          <div className="pose-output-ready">
            <span>
              Ready
            </span>

            <strong>
              Download
            </strong>
          </div>
        </header>

        <section className="pose-output-content">
          <div className="pose-output-layout">
            <div className="pose-output-preview-column">
              <div className="pose-output-mobile-toolbar">
                <button
                  type="button"
                  className="pose-output-mobile-tool"
                  onClick={
                    onStartOver
                  }
                  aria-label="Start over"
                >
                  <RefreshIcon />
                </button>

                <button
                  type="button"
                  className="pose-output-mobile-tool pose-output-mobile-download"
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
                  className="pose-output-mobile-tool pose-output-mobile-share"
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
                  className="pose-output-mobile-customize"
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
                <p className="pose-output-share-message pose-output-share-message-mobile">
                  {shareMessage}
                </p>
              )}

              <div
                className={`pose-output-photo-strip pose-output-${selectedStrip}`}
              >
                <div className="pose-output-photo-grid">
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

                      const pose =
                        selectedPoses[
                          index
                        ];

                      const reference =
                        getPoseSource(
                          pose
                        );

                      return (
                        <div
                          className="pose-output-row"
                          key={
                            index
                          }
                        >
                          <div className="pose-output-photo-frame">
                            {shot ? (
                              <img
                                src={
                                  shot
                                }
                                alt={`Pose Match shot ${
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

                          <div className="pose-output-photo-frame pose-output-reference-frame">
                            {reference ? (
                              <img
                                src={
                                  reference
                                }
                                alt={`Reference ${
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
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="pose-output-strip-footer">
                  <div className="pose-output-strip-details">
                    {showImage && (
                      <img
                        src={
                          smoraPrimary
                        }
                        alt="Smora"
                        className="pose-output-strip-mark"
                      />
                    )}

                    {showText &&
                      customText.trim() && (
                        <span
                          className="pose-output-custom-text"
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
                          className="pose-output-date"
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

            <aside className="pose-output-edit-panel">
              <div className="pose-output-panel-header">
                <div className="pose-output-panel-icon">
                  <EditIcon />
                </div>

                <h2>
                  Customize
                </h2>
              </div>

              {settings}

              <div className="pose-output-actions">
                <button
                  type="button"
                  className="pose-output-download-button"
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
                  className="pose-output-share-button"
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
                  <p className="pose-output-share-message">
                    {shareMessage}
                  </p>
                )}

                <button
                  type="button"
                  className="pose-output-start-over"
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
        <div className="pose-output-mobile-overlay">
          <div
            className="pose-output-mobile-panel"
            role="dialog"
            aria-modal="true"
          >
            <div className="pose-output-mobile-header">
              <div className="pose-output-panel-icon">
                <EditIcon />
              </div>

              <h2>
                Customize
              </h2>
            </div>

            {settings}

            <button
              type="button"
              className="pose-output-mobile-okay"
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
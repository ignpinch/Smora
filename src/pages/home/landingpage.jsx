import {
  useEffect,
  useState,
} from "react";

import "./home.css";

import primarylogo from "../../assets/smora-primary.png";

/* ========================================
   ICONS
======================================== */

function ArrowIcon({
  className = "",
}) {
  return (
    <svg
      className={className}
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

function LockIcon({
  className = "",
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CameraIcon({
  className = "",
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
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

function EyeIcon({
  className = "",
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />

      <circle
        cx="12"
        cy="12"
        r="2.8"
      />
    </svg>
  );
}

/* ========================================
   SOLO GRAPHIC
======================================== */

function SoloGraphic() {
  return (
    <div className="visual-scene solo-scene">
      <div className="solo-camera">
        <CameraIcon />
      </div>

      <div className="solo-flash flash-one">
        ✦
      </div>

      <div className="solo-flash flash-two">
        ✦
      </div>

      <div className="solo-strip">
        <div className="strip-photo">
          <div className="solo-avatar">
            <div className="avatar-head">
              <span className="avatar-eye avatar-eye-left" />
              <span className="avatar-eye avatar-eye-right" />
              <span className="avatar-smile" />
            </div>

            <div className="avatar-body" />
          </div>
        </div>

        <div className="strip-photo">
          <div className="solo-avatar">
            <div className="avatar-head">
              <span className="avatar-eye avatar-eye-left" />
              <span className="avatar-eye avatar-eye-right" />
              <span className="avatar-smile" />
            </div>

            <div className="avatar-body" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   DUO GRAPHIC
======================================== */

function DuoGraphic() {
  return (
    <div className="visual-scene locked-scene">
      <div className="duo-frame">
        <div className="duo-half duo-half-left">
          <div className="simple-avatar">
            <div className="simple-head" />
            <div className="simple-body" />
          </div>
        </div>

        <div className="duo-divider" />

        <div className="duo-half duo-half-right">
          <div className="simple-avatar">
            <div className="simple-head" />
            <div className="simple-body" />
          </div>
        </div>
      </div>

      <div className="connection-heart">
        ♥
      </div>

      <div className="locked-visual">
        <LockIcon />
      </div>
    </div>
  );
}

/* ========================================
   POSE MATCH GRAPHIC
======================================== */

function PoseMatchGraphic() {
  return (
    <div className="visual-scene pose-scene">
      <div className="pose-reference">
        <span className="pose-label">
          POSE
        </span>

        <div className="pose-stick-head">
          <span className="pose-eye pose-eye-left" />
          <span className="pose-eye pose-eye-right" />
          <span className="pose-smile" />
        </div>

        <div className="pose-stick-body" />

        <span className="pose-hand">
          ✌
        </span>
      </div>

      <div className="copy-arrow">
        <ArrowIcon />
      </div>

      <div className="pose-copy">
        <div className="copy-head">
          <span className="copy-eye copy-eye-left" />
          <span className="copy-eye copy-eye-right" />
          <span className="copy-smile" />
        </div>

        <div className="copy-body" />

        <span className="copy-hand">
          ✌
        </span>
      </div>
    </div>
  );
}

/* ========================================
   MODE CARD
======================================== */

function ModeCard({
  type,
  title,
  description,
  disabled = false,
  badge,
  onClick,
}) {
  const renderGraphic = () => {
    if (type === "solo") {
      return <SoloGraphic />;
    }

    if (type === "duo") {
      return <DuoGraphic />;
    }

    return <PoseMatchGraphic />;
  };

  const getActionText = () => {
    if (disabled) {
      return "Locked";
    }

    if (type === "pose") {
      return "Start Pose Match";
    }

    return "Start Solo";
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={
        disabled
          ? undefined
          : onClick
      }
      className={`photo-mode-card photo-mode-${type} ${
        disabled
          ? "photo-mode-disabled"
          : ""
      }`}
    >
      <div className="mode-status">
        {disabled ? (
          <span className="coming-soon">
            <LockIcon />
            Coming Soon
          </span>
        ) : (
          badge && (
            <span className="mode-badge">
              {badge}
            </span>
          )
        )}
      </div>

      <div className="mode-visual">
        {renderGraphic()}
      </div>

      <div className="mode-content">
        <h2>
          {title}
        </h2>

        <p>
          {description}
        </p>

        <div className="mode-action">
          <span>
            {getActionText()}
          </span>

          {disabled ? (
            <LockIcon />
          ) : (
            <ArrowIcon />
          )}
        </div>
      </div>
    </button>
  );
}

/* ========================================
   LANDING PAGE
======================================== */

export default function Home({
  onSoloContinue,
  onPoseMatchContinue,
}) {
  const [
    visits,
    setVisits,
  ] = useState(null);

  const [
    visitError,
    setVisitError,
  ] = useState(false);

  /* ========================================
     VISITOR COUNTER
  ======================================== */

  useEffect(() => {
    const loadVisits = async () => {
      try {
        /*
          Prevent React StrictMode from
          counting the same page load twice.
        */

        if (
          window.__smoraVisitCounted
        ) {
          return;
        }

        window.__smoraVisitCounted =
          true;

        const response =
          await fetch(
            "/api/visit",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `Visit API error: ${response.status}`
          );
        }

        const data =
          await response.json();

        if (
          typeof data.visitors !==
          "number"
        ) {
          throw new Error(
            "Invalid visitor count returned by API"
          );
        }

        setVisits(
          data.visitors
        );

        setVisitError(
          false
        );
      } catch (error) {
        console.error(
          "Visitor counter error:",
          error
        );

        /*
          Allow a future reload to try again
          when the request fails.
        */

        window.__smoraVisitCounted =
          false;

        setVisits(null);

        setVisitError(
          true
        );
      }
    };

    loadVisits();
  }, []);

  return (
    <div className="smora-home">
      <main className="smora-container">

        {/* =================================
            HEADER
        ================================= */}

        <header className="brand-header">
          <img
            src={primarylogo}
            alt="Smora"
            className="brand-logo"
          />

          <div
            className="visit-card"
            aria-label="Website visits"
          >
            <div className="visit-icon">
              <EyeIcon />
            </div>

            <div className="visit-info">
              <span className="visit-label">
                Visits
              </span>

              <strong className="visit-count">
                {visitError
                  ? "—"
                  : visits === null
                    ? "..."
                    : visits.toLocaleString()}
              </strong>
            </div>
          </div>
        </header>

        {/* =================================
            MAIN CONTENT
        ================================= */}

        <div className="landing-content">
          <section className="landing-header">
            <h1>
              How do you want to{" "}
              <span>
                snap?
              </span>
            </h1>

            <p>
              Pick a mode and start making memories.
            </p>
          </section>

          {/* =================================
              PHOTO MODES
          ================================= */}

          <section className="photo-mode-grid">

            {/* SOLO */}

            <ModeCard
              type="solo"
              title="Solo"
              description="Take your own photo strip."
              badge="Popular"
              onClick={() =>
                onSoloContinue?.()
              }
            />

            {/* DUO */}

            <ModeCard
              type="duo"
              title="Duo"
              description="Take photos together."
              disabled
            />

            {/* POSE MATCH */}

            <ModeCard
              type="pose"
              title="Pose Match"
              description="See a pose. Recreate it."
              badge="New"
              onClick={() =>
                onPoseMatchContinue?.()
              }
            />

          </section>
        </div>
      </main>
    </div>
  );
}
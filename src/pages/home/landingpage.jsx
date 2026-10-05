import { useEffect, useState } from "react";

import "./home.css";

import primarylogo from "../../assets/smora-primary.png";

function ArrowIcon({ className = "" }) {

  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">

    <path d="M5 12h14" />

    <path d="m13 6 6 6-6 6" />

  </svg>);

}

function LockIcon({ className = "" }) {

  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">

    <rect x="5" y="10" width="14" height="10" rx="2" />

    <path d="M8 10V7a4 4 0 0 1 8 0v3" />

  </svg>);

}

function CameraIcon({ className = "" }) {

  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">

    <path d="M4 7h3l1.4-2h7.2L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />

    <circle cx="12" cy="13" r="4" />

  </svg>);

}

function EyeIcon({ className = "" }) {

  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">

    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />

    <circle cx="12" cy="12" r="2.8" />

  </svg>);

}

function SparklesIcon({ className = "" }) {

  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">

    <path d="m12 3 1.25 3.75L17 8l-3.75 1.25L12 13l-1.25-3.75L7 8l3.75-1.25L12 3Z" />

    <path d="m18.5 14 0.7 2.3 2.3 0.7-2.3 0.7-0.7 2.3-0.7-2.3-2.3-0.7 2.3-0.7 0.7-2.3Z" />

    <path d="m5 13 0.8 2.2L8 16l-2.2 0.8L5 19l-0.8-2.2L2 16l2.2-0.8L5 13Z" />

  </svg>);

}

function UsersIcon({ className = "" }) {

  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">

    <circle cx="9" cy="8" r="3" />

    <circle cx="17" cy="9" r="2.5" />

    <path d="M3.5 19c.7-3.3 2.7-5 5.5-5s4.8 1.7 5.5 5" />

    <path d="M14 15.2c.8-.8 1.8-1.2 3-1.2 2.2 0 3.7 1.3 4.3 3.8" />

  </svg>);

}

function ToolIcon({ className = "" }) {

  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">

    <path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.4 2.4-3-3 2.4-2.4Z" />

  </svg>);

}

function StarIcon({ className = "" }) {

  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">

    <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />

  </svg>);

}

function PaletteIcon({ className = "" }) {

  return (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">

    <path d="M12 3a9 9 0 1 0 0 18h1.2a2.3 2.3 0 0 0 0-4.6h-.8a1.8 1.8 0 0 1 0-3.6H15A6 6 0 0 0 21 7c0-2.2-3.9-4-9-4Z" />

    <circle cx="7.5" cy="9" r="1" />

    <circle cx="10" cy="6.5" r="1" />

    <circle cx="14" cy="6.3" r="1" />

  </svg>);

}

function SoloGraphic() {

  return (<div className="visual-scene solo-scene">

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

  </div>);

}

function DuoGraphic() {

  return (<div className="visual-scene locked-scene">

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

  </div>);

}

function PoseMatchGraphic() {

  return (<div className="visual-scene pose-scene">

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

  </div>);

}

function PocketCardGraphic() {

  return (<div className="home-pokeframe-scene">

    <div className="home-pokeframe-card">

      <div className="home-pokeframe-header">

        <span className="home-pokeframe-basic">

          BASIC

        </span>

        <strong className="home-pokeframe-name">

          SMORA

        </strong>

        <div className="home-pokeframe-hp">

          <span>HP</span>

          <strong>60</strong>

          <span className="home-pokeframe-energy">

            ✦

          </span>

        </div>

      </div>

      <div className="home-pokeframe-photo">

        <div className="home-pokeframe-sky" />

        <div className="home-pokeframe-avatar">

          <div className="home-pokeframe-avatar-head">

            <span className="home-pokeframe-eye home-pokeframe-eye-left" />

            <span className="home-pokeframe-eye home-pokeframe-eye-right" />

            <span className="home-pokeframe-smile" />

          </div>

          <div className="home-pokeframe-avatar-body" />

        </div>

        <span className="home-pokeframe-photo-spark home-pokeframe-photo-spark-one">

          ✦

        </span>

        <span className="home-pokeframe-photo-spark home-pokeframe-photo-spark-two">

          ✦

        </span>

      </div>

      <div className="home-pokeframe-meta">

        NO. 001 • SMORA MEMORY • HT. 1 PIC

      </div>

      <div className="home-pokeframe-moves">

        <div className="home-pokeframe-move">

          <span className="home-pokeframe-move-energy">

            ✦

          </span>

          <div>

            <strong>Memory Snap</strong>

            <small>

              Capture a moment worth keeping.

            </small>

          </div>

        </div>

        <div className="home-pokeframe-move">

          <span className="home-pokeframe-move-energy home-pokeframe-move-energy-alt">

            ★

          </span>

          <div>

            <strong>Smile Burst</strong>

            <small>

              Turn your shot into a collectible card.

            </small>

          </div>

          <strong className="home-pokeframe-damage">

            30

          </strong>

        </div>

      </div>

      <div className="home-pokeframe-stats">

        <span>weakness ×2</span>

        <span>retreat ★</span>

      </div>

      <div className="home-pokeframe-footer">

        <span>SMORA FRAME</span>

        <span>2026</span>

      </div>

    </div>

    <span className="home-pokeframe-spark home-pokeframe-spark-one">

      ✦

    </span>

    <span className="home-pokeframe-spark home-pokeframe-spark-two">

      ✦

    </span>

  </div>);

}

function NewNextGraphic({ type }) {

  if (type === "duo") {

    return (<div className="home-feature-graphic home-feature-graphic-duo">

      <div className="home-feature-duo-window">

        <div className="home-feature-duo-person">

          <div />

          <span />

        </div>

        <div className="home-feature-duo-divider" />

        <div className="home-feature-duo-person">

          <div />

          <span />

        </div>

      </div>

      <div className="home-feature-duo-bubble">

        <UsersIcon />

      </div>

      <span className="home-feature-heart">

        ♥

      </span>

    </div>);

  }

  if (type === "idol") {

    return (<div className="home-feature-graphic home-feature-graphic-idol">

      <div className="home-idol-frame">

        <div className="home-idol-frame-top">

          <span>IDOL SNAP</span>

          <StarIcon />

        </div>

        <div className="home-idol-frame-photo">

          <div className="home-idol-cutout">

            <div className="home-idol-cutout-hair" />

            <div className="home-idol-cutout-head" />

            <div className="home-idol-cutout-neck" />

            <div className="home-idol-cutout-body" />

            <div className="home-idol-cutout-arm" />

          </div>

          <div className="home-idol-person">

            <div className="home-idol-person-hair" />

            <div className="home-idol-person-head" />

            <div className="home-idol-person-body" />

            <span className="home-idol-person-hand">

              ✌

            </span>

          </div>

          <span className="home-idol-frame-spark home-idol-frame-spark-one">

            ✦

          </span>

          <span className="home-idol-frame-spark home-idol-frame-spark-two">

            ✦

          </span>

        </div>

        <div className="home-idol-frame-footer">

          together in one frame

        </div>

      </div>

    </div>);

  }

  return (<div className="home-feature-graphic home-feature-graphic-strip">

    <div className="home-strip-builder">

      <div className="home-strip-builder-photo">

        <div />

        <span />

      </div>

      <div className="home-strip-builder-photo">

        <div />

        <span />

      </div>

      <div className="home-strip-builder-footer">

        SMORA

      </div>

    </div>

    <div className="home-strip-palette">

      <span className="home-strip-color home-strip-color-yellow" />

      <span className="home-strip-color home-strip-color-coral" />

      <span className="home-strip-color home-strip-color-blue" />

    </div>

    <div className="home-strip-palette-icon">

      <PaletteIcon />

    </div>

  </div>);

}

function HomeUpdatesSection() {
  return (<section className="home-updates-section">

    <div className="home-updates-heading">

      <span className="home-updates-kicker">

        Keep up with Smora

      </span>

      <h2>

        New things are coming.

      </h2>

      <p>

        Discover new ways to use Smora and see what we are improving next.

      </p>

    </div>

    <div className="home-improvements-panel">

      <div className="home-panel-heading">

        <div className="home-panel-icon home-panel-icon-update">

          <ToolIcon />

        </div>

        <div>
          <h3>Updates and improvements</h3>

        </div>

      </div>

      <div className="home-improvements-empty">

        <div className="home-improvements-empty-copy">
          <strong>More improvements are on the way.</strong>
          <p>
            We&apos;re polishing Smora behind the scenes. New updates and improvements will appear here as soon as they&apos;re ready.
          </p>
        </div>
      </div>
    </div>

    <div className="home-new-section">

      <div className="home-panel-heading home-new-heading">

        <div className="home-panel-icon home-panel-icon-new">

          <SparklesIcon />

        </div>

        <div>

          <span>What's New</span>

          <h3>New ways to make memories</h3>

        </div>

      </div>

      <div className="home-new-grid">

        <article className="home-feature-card">

          <NewNextGraphic type="duo" />

          <div className="home-feature-copy">

            <span className="home-feature-status home-feature-status-soon">

              Upcoming

            </span>

            <h4>Duo</h4>

            <p>

              Take a photobooth together even when you are not in the same place.

            </p>

          </div>

        </article>

        <article className="home-feature-card">

          <NewNextGraphic type="idol" />

          <div className="home-feature-copy">

            <span className="home-feature-status home-feature-status-soon">

              Upcoming

            </span>

            <h4>Idol Snap</h4>

            <p>

              Pose in the same frame with a cutout of your favorite idol and make it look like you took the photobooth together.

            </p>

          </div>

        </article>

        <article className="home-feature-card">

          <NewNextGraphic type="strip" />

          <div className="home-feature-copy">

            <span className="home-feature-status home-feature-status-soon">

              Upcoming

            </span>

            <h4>Make Your Own Strip Design</h4>

            <p>

              Personalize your photo strip and make the final design feel more like you.

            </p>

          </div>

        </article>

      </div>

    </div>

  </section>);

}

function HomeFooter() {

  return (<footer className="smora-footer">

    <div className="smora-footer-brand">

      <img src={primarylogo} alt="Smora" />

      <div>

        <strong>

          Smile with Memories

        </strong>

        <span>

          Little moments, made worth keeping.

        </span>

      </div>

    </div>

    <span className="smora-footer-copy">

      © 2026 Smora

    </span>

  </footer>);

}

function ModeCard({ type, title, description, disabled = false, badge, onClick }) {

  const renderGraphic = () => {

    if (type === "solo") {

      return <SoloGraphic />;

    }

    if (type === "duo") {

      return <DuoGraphic />;

    }

    if (type === "pokeframe") {

      return (<div className="mode-pokeframe-graphic">

        <PocketCardGraphic />

      </div>);

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

    if (type === "pokeframe") {
      return "Try PokeFrame";
    }

    return "Start Photo Booth";

  };

  return (<button type="button" disabled={disabled} onClick={disabled

    ? undefined

    : onClick} className={`photo-mode-card photo-mode-${type} ${disabled

      ? "photo-mode-disabled"

      : ""}`}>

    <div className="mode-status">

      {disabled ? (
        <span className="coming-soon">
          <LockIcon />
          Coming Soon
        </span>
      ) : (
        badge && (
          <span
            className={`mode-badge ${type === "pokeframe" ? "mode-badge-new" : ""
              }`}
          >
            {badge}
          </span>
        )
      )}

    </div>

    <div className="mode-visual">

      {renderGraphic()}

    </div>

    <div className="mode-content">

      <span className="mode-kicker">

        {type === "pose"

          ? "Recreate a pose"

          : type === "pokeframe"

            ? "Collectible photo card"

            : "Classic photobooth"}

      </span>

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

        {disabled ? (<LockIcon />) : (<ArrowIcon />)}

      </div>

    </div>

  </button>);

}

export default function Home({
  onSoloContinue,
  onPoseMatchContinue,
  onPokeFrameContinue,
}) {

  const [visits, setVisits,] = useState(null);

  const [visitError, setVisitError] = useState(false);

  useEffect(() => {

    const loadVisits = async () => {

      try {

        if (window.__smoraVisitCounted) {

          return;

        }

        window.__smoraVisitCounted =

          true;

        const response = await fetch("/api/visit", {

          method: "GET",

          cache: "no-store"
        });

        if (!response.ok) {

          throw new Error(`Visit API error: ${response.status}`);

        }

        const data = await response.json();

        if (typeof data.visitors !==

          "number") {

          throw new Error("Invalid visitor count returned by API");

        }

        setVisits(data.visitors);

        setVisitError(false);

      }

      catch (error) {

        console.error("Visitor counter error:", error);

        window.__smoraVisitCounted =

          false;

        setVisits(null);

        setVisitError(true);

      }

    };

    loadVisits();

  }, []);

  return (<div className="smora-home">

    <main className="smora-container">

      <header className="brand-header">

        <img src={primarylogo} alt="Smora" className="brand-logo" />

        <div className="header-tools">

          <div className="visit-card" aria-label="Website visits" title="Website visits">

            <EyeIcon />

            <strong className="visit-count">

              {visitError

                ? "—"

                : visits === null

                  ? "..."

                  : visits.toLocaleString()}

            </strong>

          </div>

          <button type="button" className="download-smora-button download-smora-button-locked" aria-label="Download Smora is coming soon" title="Download Smora — Coming soon" disabled>

            <LockIcon />

            <span>

              Download Smora

            </span>

          </button>

        </div>

      </header>

      <div className="landing-content">

        <section className="home-mode-section">

          <section className="photo-mode-grid">

            <ModeCard
              type="solo"
              title="Photo Booth"
              description="Take photos your way and turn them into a photo strip."
              badge="Popular"
              onClick={() => onSoloContinue?.()}
            />

            <ModeCard
              type="pose"
              title="Pose Match"
              description="Choose a pose reference, recreate it, and make your strip."
              onClick={() => onPoseMatchContinue?.()}
            />

            <ModeCard
              type="pokeframe"
              title="PokeFrame"
              description="Turn your photo into a collectible card-style frame."
              badge="New"
              onClick={() => onPokeFrameContinue?.()}
            />

          </section>

        </section>

        <HomeUpdatesSection />

      </div>        <HomeFooter />

    </main>

  </div>);

}

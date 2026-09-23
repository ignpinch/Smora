import { useEffect, useState } from "react";
import "./pose_match_reference.css";

import pose1 from "../../assets/pose/pose1.jpg";
import pose2 from "../../assets/pose/pose2.jpg";
import pose3 from "../../assets/pose/pose3.jpg";
import pose4 from "../../assets/pose/pose4.jpg";
import pose5 from "../../assets/pose/pose5.jpg";
import pose6 from "../../assets/pose/pose6.jpg";
import pose7 from "../../assets/pose/pose7.jpg";
import pose8 from "../../assets/pose/pose8.jpg";
import pose9 from "../../assets/pose/pose9.jpg";
import pose10 from "../../assets/pose/pose10.jpg";
import pose11 from "../../assets/pose/pose11.jpg";
import pose12 from "../../assets/pose/pose12.jpg";

const MAX_POSES = 4;

const poseReferences = [
  { id: "pose1", image: pose1 },
  { id: "pose2", image: pose2 },
  { id: "pose3", image: pose3 },
  { id: "pose4", image: pose4 },
  { id: "pose5", image: pose5 },
  { id: "pose6", image: pose6 },
  { id: "pose7", image: pose7 },
  { id: "pose8", image: pose8 },
  { id: "pose9", image: pose9 },
  { id: "pose10", image: pose10 },
  { id: "pose11", image: pose11 },
  { id: "pose12", image: pose12 },
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

function PoseCard({
  pose,
  selected,
  selectedNumber,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`pose-reference-card ${
        selected
          ? "pose-reference-card-selected"
          : ""
      } ${
        disabled
          ? "pose-reference-card-disabled"
          : ""
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      <div className="pose-card-image-wrap">
        <img
          src={pose.image}
          alt={`Pose reference ${pose.id}`}
          className="pose-card-image"
        />

        {selected && (
          <div className="pose-selected-badge">
            <CheckIcon />

            <span>
              {selectedNumber}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

export default function PoseMatchReference({
  selectedPoses = [],
  onBack,
  onContinue,
}) {
  const [selected, setSelected] = useState(
    selectedPoses
  );

  useEffect(() => {
    setSelected(selectedPoses);
  }, [selectedPoses]);

  const togglePose = (pose) => {
    const alreadySelected =
      selected.some(
        (item) =>
          item.id === pose.id
      );

    if (alreadySelected) {
      setSelected(
        selected.filter(
          (item) =>
            item.id !== pose.id
        )
      );

      return;
    }

    if (
      selected.length >=
      MAX_POSES
    ) {
      return;
    }

    setSelected([
      ...selected,
      pose,
    ]);
  };

  const removeSelectedPose = (
    pose
  ) => {
    setSelected(
      selected.filter(
        (item) =>
          item.id !== pose.id
      )
    );
  };

  const isComplete =
    selected.length ===
    MAX_POSES;

  return (
    <div className="pose-reference-page">
      <main className="pose-reference-container">
        <header className="pose-reference-header">
          <button
            type="button"
            className="pose-reference-back"
            onClick={onBack}
          >
            <ArrowLeftIcon />

            <span>
              Back
            </span>
          </button>

          <div className="pose-reference-step">
            <span>
              Step 3
            </span>

            <strong>
              Pose Reference
            </strong>
          </div>

          <div className="pose-reference-next">
            <span>
              Next
            </span>

            <strong>
              Photo Booth
            </strong>
          </div>
        </header>

        <section className="pose-reference-hero">
          <h1>
            Pick your{" "}
            <span>
              4 references.
            </span>
          </h1>

          <p>
            Choose 4 meme poses you want to recreate.
          </p>

        </section>

        <section className="pose-reference-grid">
          {poseReferences.map(
            (pose) => {
              const selectedIndex =
                selected.findIndex(
                  (item) =>
                    item.id ===
                    pose.id
                );

              const isSelected =
                selectedIndex !== -1;

              const disabled =
                !isSelected &&
                selected.length >=
                  MAX_POSES;

              return (
                <PoseCard
                  key={
                    pose.id
                  }
                  pose={
                    pose
                  }
                  selected={
                    isSelected
                  }
                  selectedNumber={
                    selectedIndex +
                    1
                  }
                  disabled={
                    disabled
                  }
                  onClick={() =>
                    togglePose(
                      pose
                    )
                  }
                />
              );
            }
          )}
        </section>

        <section className="selected-pose-bar">
          <div className="selected-pose-slots">
            {Array.from({
              length:
                MAX_POSES,
            }).map(
              (
                _,
                index
              ) => {
                const pose =
                  selected[
                    index
                  ];

                return (
                  <div
                    key={
                      index
                    }
                    className={`selected-pose-slot ${
                      pose
                        ? "selected-pose-slot-filled"
                        : ""
                    }`}
                  >
                    {pose ? (
                      <button
                        type="button"
                        className="selected-pose-remove"
                        onClick={() =>
                          removeSelectedPose(
                            pose
                          )
                        }
                        aria-label={`Remove reference ${
                          index +
                          1
                        }`}
                      >
                        <img
                          src={
                            pose.image
                          }
                          alt=""
                        />

                        <span className="selected-slot-number">
                          {index +
                            1}
                        </span>

                        <span className="selected-slot-remove-icon">
                          ×
                        </span>
                      </button>
                    ) : (
                      <span className="empty-slot-number">
                        {index +
                          1}
                      </span>
                    )}
                  </div>
                );
              }
            )}
          </div>

          <button
            type="button"
            className="pose-reference-continue"
            disabled={
              !isComplete
            }
            onClick={() =>
              onContinue?.(
                selected
              )
            }
          >
            <span>
              Continue
            </span>

            <ArrowRightIcon />
          </button>
        </section>
      </main>
    </div>
  );
}
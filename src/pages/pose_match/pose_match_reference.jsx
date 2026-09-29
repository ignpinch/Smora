import { useEffect, useMemo, useState } from "react";
import "./pose_match_reference.css";
import soloPose1 from "../../assets/pose/solo_pose1.jpg";
import soloPose2 from "../../assets/pose/solo_pose2.jpg";
import soloPose3 from "../../assets/pose/solo_pose3.jpg";
import soloPose4 from "../../assets/pose/solo_pose4.jpg";
import soloPose5 from "../../assets/pose/solo_pose5.jpg";
import soloPose6 from "../../assets/pose/solo_pose6.jpg";
import soloPose7 from "../../assets/pose/solo_pose7.jpg";
import soloPose8 from "../../assets/pose/solo_pose8.jpg";
import soloPose9 from "../../assets/pose/solo_pose9.jpg";
import soloPose10 from "../../assets/pose/solo_pose10.jpg";
import soloPose11 from "../../assets/pose/solo_pose11.jpg";
import soloPose12 from "../../assets/pose/solo_pose12.jpg";
import duoPose1 from "../../assets/pose/duo_pose1.jpg";
import duoPose2 from "../../assets/pose/duo_pose2.jpg";
import duoPose3 from "../../assets/pose/duo_pose3.jpg";
import duoPose4 from "../../assets/pose/duo_pose4.jpg";
import duoPose5 from "../../assets/pose/duo_pose5.jpg";
import duoPose6 from "../../assets/pose/duo_pose6.jpg";
import duoPose7 from "../../assets/pose/duo_pose7.jpg";
import duoPose8 from "../../assets/pose/duo_pose8.jpg";
import duoPose9 from "../../assets/pose/duo_pose9.jpg";
import duoPose10 from "../../assets/pose/duo_pose10.jpg";
import groupPose1 from "../../assets/pose/group_pose1.jpg";
import groupPose2 from "../../assets/pose/group_pose2.jpg";
import groupPose3 from "../../assets/pose/group_pose3.jpg";
import groupPose4 from "../../assets/pose/group_pose4.jpg";
import groupPose5 from "../../assets/pose/group_pose5.jpg";
import groupPose6 from "../../assets/pose/group_pose6.jpg";
const MAX_POSES = 4;
const referenceGroups = {
    solo: [
        { id: "solo_pose1", image: soloPose1, type: "solo" },
        { id: "solo_pose2", image: soloPose2, type: "solo" },
        { id: "solo_pose3", image: soloPose3, type: "solo" },
        { id: "solo_pose4", image: soloPose4, type: "solo" },
        { id: "solo_pose5", image: soloPose5, type: "solo" },
        { id: "solo_pose6", image: soloPose6, type: "solo" },
        { id: "solo_pose7", image: soloPose7, type: "solo" },
        { id: "solo_pose8", image: soloPose8, type: "solo" },
        { id: "solo_pose9", image: soloPose9, type: "solo" },
        { id: "solo_pose10", image: soloPose10, type: "solo" },
        { id: "solo_pose11", image: soloPose11, type: "solo" },
        { id: "solo_pose12", image: soloPose12, type: "solo" },
    ],
    duo: [
        { id: "duo_pose1", image: duoPose1, type: "duo" },
        { id: "duo_pose2", image: duoPose2, type: "duo" },
        { id: "duo_pose3", image: duoPose3, type: "duo" },
        { id: "duo_pose4", image: duoPose4, type: "duo" },
        { id: "duo_pose5", image: duoPose5, type: "duo" },
        { id: "duo_pose6", image: duoPose6, type: "duo" },
        { id: "duo_pose7", image: duoPose7, type: "duo" },
        { id: "duo_pose8", image: duoPose8, type: "duo" },
        { id: "duo_pose9", image: duoPose9, type: "duo" },
        { id: "duo_pose10", image: duoPose10, type: "duo" },
    ],
    group: [
        { id: "group_pose1", image: groupPose1, type: "group" },
        { id: "group_pose2", image: groupPose2, type: "group" },
        { id: "group_pose3", image: groupPose3, type: "group" },
        { id: "group_pose4", image: groupPose4, type: "group" },
        { id: "group_pose5", image: groupPose5, type: "group" },
        { id: "group_pose6", image: groupPose6, type: "group" },
    ],
};
const referenceTabs = [
    { id: "all", label: "All", count: 28 },
    { id: "solo", label: "Solo", count: 12 },
    { id: "duo", label: "Duo", count: 10 },
    { id: "group", label: "Group", count: 6 },
];
function ArrowLeftIcon() {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">

      <path d="M19 12H5"/>

      <path d="m11 18-6-6 6-6"/>

    </svg>);
}
function ArrowRightIcon() {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">

      <path d="M5 12h14"/>

      <path d="m13 6 6 6-6 6"/>

    </svg>);
}
function CheckIcon() {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">

      <path d="m5 12 4 4L19 6"/>

    </svg>);
}
function PersonIcon() {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">

      <circle cx="12" cy="7" r="3"/>

      <path d="M5 21c.7-4.5 3-7 7-7s6.3 2.5 7 7"/>

    </svg>);
}
function DuoIcon() {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">

      <circle cx="8" cy="8" r="3"/>

      <circle cx="16" cy="8" r="3"/>

      <path d="M2.5 21c.5-4 2.4-6.2 5.5-6.2S13 17 13.5 21"/>

      <path d="M10.5 21c.5-4 2.4-6.2 5.5-6.2S21 17 21.5 21"/>

    </svg>);
}
function GroupIcon() {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

      <circle cx="12" cy="6.5" r="2.7"/>

      <circle cx="5.5" cy="9" r="2.2"/>

      <circle cx="18.5" cy="9" r="2.2"/>

      <path d="M7 21c.5-4.3 2.1-6.5 5-6.5s4.5 2.2 5 6.5"/>

      <path d="M1.5 21c.3-3.2 1.7-5 4-5 1 0 1.9.3 2.6.8"/>

      <path d="M22.5 21c-.3-3.2-1.7-5-4-5-1 0-1.9.3-2.6.8"/>

    </svg>);
}
function AllIcon() {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="6" height="6" rx="1.5"/>
      <rect x="14" y="4" width="6" height="6" rx="1.5"/>
      <rect x="4" y="14" width="6" height="6" rx="1.5"/>
      <rect x="14" y="14" width="6" height="6" rx="1.5"/>
    </svg>);
}
function TabIcon({ type }) {
    if (type === "all") {
        return <AllIcon />;
    }
    if (type === "duo") {
        return <DuoIcon />;
    }
    if (type === "group") {
        return <GroupIcon />;
    }
    return <PersonIcon />;
}
function PoseCard({ pose, selected, selectedNumber, disabled, onClick, }) {
    return (<button type="button" className={`pose-reference-card ${selected
            ? "pose-reference-card-selected"
            : ""} ${disabled
            ? "pose-reference-card-disabled"
            : ""}`} disabled={disabled} onClick={onClick} aria-label={`Pose reference ${pose.id}`}>

      <div className="pose-card-image-wrap">

        <img src={pose.image} alt={`Pose reference ${pose.id}`} className="pose-card-image"/>

        {selected && (<div className="pose-selected-badge">

            <CheckIcon />

            <span>{selectedNumber}</span>

          </div>)}

      </div>

    </button>);
}
export default function PoseMatchReference({ selectedPoses = [], onBack, onContinue, }) {
    const [selected, setSelected] = useState(selectedPoses);
    const [activeType, setActiveType] = useState("all");
    useEffect(() => {
        setSelected(selectedPoses);
    }, [selectedPoses]);
    const visibleReferences = useMemo(() => {
        if (activeType === "all") {
            return [
                ...referenceGroups.solo,
                ...referenceGroups.duo,
                ...referenceGroups.group,
            ];
        }
        return referenceGroups[activeType] || [];
    }, [activeType]);
    const togglePose = (pose) => {
        const alreadySelected = selected.some((item) => item.id === pose.id);
        if (alreadySelected) {
            setSelected(selected.filter((item) => item.id !== pose.id));
            return;
        }
        if (selected.length >=
            MAX_POSES) {
            return;
        }
        setSelected([
            ...selected,
            pose,
        ]);
    };
    const removeSelectedPose = (pose) => {
        setSelected(selected.filter((item) => item.id !== pose.id));
    };
    const isComplete = selected.length ===
        MAX_POSES;
    return (<div className="pose-reference-page">

      <main className="pose-reference-container">

        <header className="pose-reference-header">

          <button type="button" className="pose-reference-back" onClick={onBack}>

            <ArrowLeftIcon />

            <span>Back</span>

          </button>

          <div className="pose-reference-step">

            <span>Step 2</span>

            <strong>

              Select References

            </strong>

          </div>

          <div className="pose-reference-next">

            <span>Next</span>

            <strong>

              Photo Booth

            </strong>

          </div>

        </header>

        <section className="pose-reference-hero">

          <div>

            <span className="pose-reference-eyebrow">

            </span>

            <h1>

              Choose your 4 references

            </h1>

          </div>

        </section>

        <section className="pose-reference-tabs">

          {referenceTabs.map((tab) => (<button key={tab.id} type="button" className={`pose-reference-tab ${activeType ===
                tab.id
                ? "pose-reference-tab-active"
                : ""}`} onClick={() => setActiveType(tab.id)}>

                <span className="pose-reference-tab-icon">

                  <TabIcon type={tab.id}/>

                </span>

                <span className="pose-reference-tab-copy">

                  <strong>

                    {tab.label}

                  </strong>

                  <small>

                    {tab.count} poses

                  </small>

                </span>

              </button>))}

        </section>

        <section className="pose-reference-grid">

          {visibleReferences.map((pose) => {
            const selectedIndex = selected.findIndex((item) => item.id ===
                pose.id);
            const isSelected = selectedIndex !== -1;
            const disabled = !isSelected &&
                selected.length >=
                    MAX_POSES;
            return (<PoseCard key={pose.id} pose={pose} selected={isSelected} selectedNumber={selectedIndex + 1} disabled={disabled} onClick={() => togglePose(pose)}/>);
        })}

        </section>

        <section className="selected-pose-bar">

          <div className="selected-pose-info">

            <span>

              Selected

            </span>

            <strong>

              {selected.length} of{" "}

              {MAX_POSES}

            </strong>

          </div>

          <div className="selected-pose-slots">

            {Array.from({
            length: MAX_POSES,
        }).map((_, index) => {
            const pose = selected[index];
            return (<div key={index} className={`selected-pose-slot ${pose
                    ? "selected-pose-slot-filled"
                    : ""}`}>

                    {pose ? (<button type="button" className="selected-pose-remove" onClick={() => removeSelectedPose(pose)} aria-label={`Remove reference ${index +
                        1}`}>

                        <img src={pose.image} alt=""/>

                        <span className="selected-slot-number">

                          {index +
                        1}

                        </span>

                        <span className="selected-slot-remove-icon">

                          ×

                        </span>

                      </button>) : (<span className="empty-slot-number">

                        {index +
                        1}

                      </span>)}

                  </div>);
        })}

          </div>

          <button type="button" className="pose-reference-continue" disabled={!isComplete} onClick={() => onContinue?.(selected)}>

            <span>

              Continue

            </span>

            <ArrowRightIcon />

          </button>

        </section>

      </main>

    </div>);
}

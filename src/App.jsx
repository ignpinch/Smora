import { useEffect, useState } from "react";
import "./App.css";

import Home from "./pages/home/landingpage.jsx";

import SoloCamera from "./pages/solo/camera/solo_camera.jsx";
import SoloFilter from "./pages/solo/filter/solo_filter.jsx";
import SoloStrip from "./pages/solo/strip/solo_strip.jsx";
import SoloPhotobooth from "./pages/solo/photobooth/solo_photobooth.jsx";
import SoloOutput from "./pages/solo/output/solo_output.jsx";

import PoseMatchReference from "./pages/pose_match/pose_match_reference.jsx";
import PoseMatchStrip from "./pages/pose_match/pose_match_strip.jsx";
import PoseMatchPhotobooth from "./pages/pose_match/pose_match_photobooth.jsx";
import PoseMatchOutput from "./pages/pose_match/pose_match_output.jsx";

function getCurrentRoute() {
  const pathname = window.location.pathname;

  if (
    pathname ===
    "/pose-match/output"
  ) {
    return "pose-match-output";
  }

  if (
    pathname ===
    "/pose-match/photobooth"
  ) {
    return "pose-match-photobooth";
  }

  if (
    pathname ===
    "/pose-match/strip"
  ) {
    return "pose-match-strip";
  }

  if (
    pathname ===
    "/pose-match/reference"
  ) {
    return "pose-match-reference";
  }

  if (
    pathname ===
    "/pose-match/filter"
  ) {
    return "pose-match-filter";
  }

  if (
    pathname ===
    "/pose-match/camera"
  ) {
    return "pose-match-camera";
  }

  if (
    pathname ===
    "/solo/output"
  ) {
    return "solo-output";
  }

  if (
    pathname ===
    "/solo/photobooth"
  ) {
    return "solo-photobooth";
  }

  if (
    pathname ===
    "/solo/strip"
  ) {
    return "solo-strip";
  }

  if (
    pathname ===
    "/solo/filter"
  ) {
    return "solo-filter";
  }

  if (
    pathname ===
    "/solo"
  ) {
    return "solo-camera";
  }

  return "home";
}

function App() {
  const [
    route,
    setRoute,
  ] = useState("home");

  const [
    cameraSettings,
    setCameraSettings,
  ] = useState({
    cameraId: "",
    mirrored: true,
  });

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState(
    "original"
  );

  const [
    selectedStrip,
    setSelectedStrip,
  ] = useState(
    "clean"
  );

  const [
    soloShots,
    setSoloShots,
  ] = useState([]);

  const [
    selectedPoseReferences,
    setSelectedPoseReferences,
  ] = useState([]);

  const [
    selectedPoseStrip,
    setSelectedPoseStrip,
  ] = useState(
    "cream"
  );

  const [
    poseMatchShots,
    setPoseMatchShots,
  ] = useState([]);

  useEffect(() => {
    const pathname =
      window.location.pathname;

    const isInternalNavigation =
      window.history.state
        ?.smoraNavigation ===
      true;

    if (
      pathname !== "/" &&
      !isInternalNavigation
    ) {
      window.history.replaceState(
        {},
        "",
        "/"
      );

      setRoute(
        "home"
      );
    } else {
      setRoute(
        getCurrentRoute()
      );
    }

    const handlePopState =
      () => {
        setRoute(
          getCurrentRoute()
        );
      };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  const navigate = (
    path
  ) => {
    window.history.pushState(
      {
        smoraNavigation:
          true,
      },
      "",
      path
    );

    setRoute(
      getCurrentRoute()
    );
  };

  const resetSharedSettings =
    () => {
      setCameraSettings({
        cameraId: "",
        mirrored: true,
      });

      setSelectedFilter(
        "original"
      );
    };

  const handleBackHome =
    () => {
      setSoloShots(
        []
      );

      setSelectedPoseReferences(
        []
      );

      setPoseMatchShots(
        []
      );

      window.history.pushState(
        {},
        "",
        "/"
      );

      setRoute(
        "home"
      );
    };

  const handleSoloStart =
    () => {
      resetSharedSettings();

      setSelectedStrip(
        "clean"
      );

      setSoloShots(
        []
      );

      navigate(
        "/solo"
      );
    };

  const handlePoseMatchStart =
    () => {
      resetSharedSettings();

      setSelectedPoseReferences(
        []
      );

      setSelectedPoseStrip(
        "cream"
      );

      setPoseMatchShots(
        []
      );

      navigate(
        "/pose-match/camera"
      );
    };

  const handleSoloStartOver =
    () => {
      resetSharedSettings();

      setSelectedStrip(
        "clean"
      );

      setSoloShots(
        []
      );

      navigate(
        "/solo"
      );
    };

  const handlePoseMatchStartOver =
    () => {
      resetSharedSettings();

      setSelectedPoseReferences(
        []
      );

      setSelectedPoseStrip(
        "cream"
      );

      setPoseMatchShots(
        []
      );

      navigate(
        "/pose-match/camera"
      );
    };

  if (
    route ===
    "solo-camera"
  ) {
    return (
      <SoloCamera
        onBack={
          handleBackHome
        }
        onContinue={(
          settings
        ) => {
          setCameraSettings(
            settings
          );

          navigate(
            "/solo/filter"
          );
        }}
      />
    );
  }

  if (
    route ===
    "pose-match-camera"
  ) {
    return (
      <SoloCamera
        onBack={
          handleBackHome
        }
        onContinue={(
          settings
        ) => {
          setCameraSettings(
            settings
          );

          navigate(
            "/pose-match/filter"
          );
        }}
      />
    );
  }

  if (
    route ===
    "solo-filter"
  ) {
    return (
      <SoloFilter
        cameraId={
          cameraSettings.cameraId
        }
        mirrored={
          cameraSettings.mirrored
        }
        selectedFilter={
          selectedFilter
        }
        onBack={() => {
          navigate(
            "/solo"
          );
        }}
        onContinue={(
          filter
        ) => {
          setSelectedFilter(
            filter
          );

          navigate(
            "/solo/strip"
          );
        }}
      />
    );
  }

  if (
    route ===
    "pose-match-filter"
  ) {
    return (
      <SoloFilter
        cameraId={
          cameraSettings.cameraId
        }
        mirrored={
          cameraSettings.mirrored
        }
        selectedFilter={
          selectedFilter
        }
        onBack={() => {
          navigate(
            "/pose-match/camera"
          );
        }}
        onContinue={(
          filter
        ) => {
          setSelectedFilter(
            filter
          );

          navigate(
            "/pose-match/reference"
          );
        }}
      />
    );
  }

  if (
    route ===
    "pose-match-reference"
  ) {
    return (
      <PoseMatchReference
        selectedPoses={
          selectedPoseReferences
        }
        onBack={() => {
          navigate(
            "/pose-match/filter"
          );
        }}
        onContinue={(
          poses
        ) => {
          setSelectedPoseReferences(
            poses
          );

          navigate(
            "/pose-match/strip"
          );
        }}
      />
    );
  }

  if (
    route ===
    "pose-match-strip"
  ) {
    return (
      <PoseMatchStrip
        cameraId={
          cameraSettings.cameraId
        }
        mirrored={
          cameraSettings.mirrored
        }
        selectedFilter={
          selectedFilter
        }
        selectedPoses={
          selectedPoseReferences
        }
        selectedStrip={
          selectedPoseStrip
        }
        onBack={() => {
          navigate(
            "/pose-match/reference"
          );
        }}
        onContinue={(
          strip
        ) => {
          setSelectedPoseStrip(
            strip
          );

          setPoseMatchShots(
            []
          );

          navigate(
            "/pose-match/photobooth"
          );
        }}
      />
    );
  }

  if (
    route ===
    "pose-match-photobooth"
  ) {
    return (
      <PoseMatchPhotobooth
        cameraId={
          cameraSettings.cameraId
        }
        mirrored={
          cameraSettings.mirrored
        }
        selectedFilter={
          selectedFilter
        }
        selectedStrip={
          selectedPoseStrip
        }
        selectedPoses={
          selectedPoseReferences
        }
        initialShots={
          poseMatchShots
        }
        onBack={() => {
          navigate(
            "/pose-match/strip"
          );
        }}
        onContinue={(
          shots
        ) => {
          setPoseMatchShots(
            shots
          );

          navigate(
            "/pose-match/output"
          );
        }}
      />
    );
  }

  if (
    route ===
    "pose-match-output"
  ) {
    return (
      <PoseMatchOutput
        shots={
          poseMatchShots
        }
        selectedPoses={
          selectedPoseReferences
        }
        selectedStrip={
          selectedPoseStrip
        }
        onBack={() => {
          navigate(
            "/pose-match/photobooth"
          );
        }}
        onStartOver={
          handlePoseMatchStartOver
        }
      />
    );
  }

  if (
    route ===
    "solo-strip"
  ) {
    return (
      <SoloStrip
        cameraId={
          cameraSettings.cameraId
        }
        mirrored={
          cameraSettings.mirrored
        }
        selectedFilter={
          selectedFilter
        }
        selectedStrip={
          selectedStrip
        }
        onBack={() => {
          navigate(
            "/solo/filter"
          );
        }}
        onContinue={(
          strip
        ) => {
          setSelectedStrip(
            strip
          );

          setSoloShots(
            []
          );

          navigate(
            "/solo/photobooth"
          );
        }}
      />
    );
  }

  if (
    route ===
    "solo-photobooth"
  ) {
    return (
      <SoloPhotobooth
        cameraId={
          cameraSettings.cameraId
        }
        mirrored={
          cameraSettings.mirrored
        }
        selectedFilter={
          selectedFilter
        }
        selectedStrip={
          selectedStrip
        }
        onBack={() => {
          navigate(
            "/solo/strip"
          );
        }}
        onContinue={(
          shots
        ) => {
          setSoloShots(
            shots
          );

          navigate(
            "/solo/output"
          );
        }}
      />
    );
  }

  if (
    route ===
    "solo-output"
  ) {
    return (
      <SoloOutput
        shots={
          soloShots
        }
        selectedFilter={
          selectedFilter
        }
        selectedStrip={
          selectedStrip
        }
        onBack={() => {
          navigate(
            "/solo/photobooth"
          );
        }}
        onStartOver={
          handleSoloStartOver
        }
      />
    );
  }

  return (
    <Home
      onSoloContinue={
        handleSoloStart
      }
      onPoseMatchContinue={
        handlePoseMatchStart
      }
    />
  );
}

export default App;
import { useEffect, useState } from "react";

import "./App.css";

import Home from "./pages/home/landingpage.jsx";

import SoloCamera from "./pages/solo/camera/solo_camera.jsx";
import SoloPhotobooth from "./pages/solo/photobooth/solo_photobooth.jsx";
import SoloOutput from "./pages/solo/output/solo_output.jsx";

import PoseMatchReference from "./pages/pose_match/pose_match_reference.jsx";
import PoseMatchPhotobooth from "./pages/pose_match/pose_match_photobooth.jsx";
import PoseMatchOutput from "./pages/pose_match/pose_match_output.jsx";

function getCurrentRoute() {
  const pathname = window.location.pathname;

  if (pathname === "/pokeframe/camera") {
    return "pokeframe-camera";
  }

  if (pathname === "/pose-match/output") {
    return "pose-match-output";
  }

  if (pathname === "/pose-match/photobooth") {
    return "pose-match-photobooth";
  }

  if (pathname === "/pose-match/reference") {
    return "pose-match-reference";
  }

  if (pathname === "/pose-match/camera") {
    return "pose-match-camera";
  }

  if (pathname === "/solo/output") {
    return "solo-output";
  }

  if (pathname === "/solo/photobooth") {
    return "solo-photobooth";
  }

  if (
    pathname === "/solo/camera" ||
    pathname === "/solo"
  ) {
    return "solo-camera";
  }

  return "home";
}

function App() {
  const [route, setRoute] = useState("home");

  const [cameraSettings, setCameraSettings] = useState({
    cameraId: "",
    mirrored: true,
  });

  const [soloShots, setSoloShots] = useState([]);

  const [
    selectedPoseReferences,
    setSelectedPoseReferences,
  ] = useState([]);

  const [
    poseMatchShots,
    setPoseMatchShots,
  ] = useState([]);

  useEffect(() => {
    const pathname = window.location.pathname;

    const isInternalNavigation =
      window.history.state?.smoraNavigation === true;

    if (
      pathname !== "/" &&
      !isInternalNavigation
    ) {
      window.history.replaceState(
        {},
        "",
        "/"
      );

      setRoute("home");
    } else {
      setRoute(getCurrentRoute());
    }

    const handlePopState = () => {
      setRoute(getCurrentRoute());
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

  const navigate = (path) => {
    window.history.pushState(
      {
        smoraNavigation: true,
      },
      "",
      path
    );

    setRoute(getCurrentRoute());
  };

  const resetCameraSettings = () => {
    setCameraSettings({
      cameraId: "",
      mirrored: true,
    });
  };

  const handleBackHome = () => {
    setSoloShots([]);
    setSelectedPoseReferences([]);
    setPoseMatchShots([]);

    window.history.pushState(
      {},
      "",
      "/"
    );

    setRoute("home");
  };

  const handleSoloStart = () => {
    resetCameraSettings();
    setSoloShots([]);

    navigate("/solo/camera");
  };

  const handlePoseMatchStart = () => {
    resetCameraSettings();
    setSelectedPoseReferences([]);
    setPoseMatchShots([]);

    navigate("/pose-match/camera");
  };

  const handlePokeFrameStart = () => {
    resetCameraSettings();
    setSoloShots([]);

    navigate("/pokeframe/camera");
  };

  const handleSoloStartOver = () => {
    resetCameraSettings();
    setSoloShots([]);

    navigate("/solo/camera");
  };

  const handlePoseMatchStartOver = () => {
    resetCameraSettings();
    setSelectedPoseReferences([]);
    setPoseMatchShots([]);

    navigate("/pose-match/camera");
  };

  if (route === "solo-camera") {
    return (
      <SoloCamera
        onBack={handleBackHome}
        onContinue={(settings) => {
          setCameraSettings(settings);
          setSoloShots([]);

          navigate("/solo/photobooth");
        }}
      />
    );
  }

  if (route === "pokeframe-camera") {
    return (
      <SoloCamera
        onBack={handleBackHome}
        onContinue={(settings) => {
          setCameraSettings(settings);
          setSoloShots([]);

          navigate("/solo/photobooth");
        }}
      />
    );
  }

  if (route === "solo-photobooth") {
    return (
      <SoloPhotobooth
        cameraId={cameraSettings.cameraId}
        mirrored={cameraSettings.mirrored}
        selectedFilter="original"
        selectedStrip="clean"
        initialShots={soloShots}
        onBack={() => {
          navigate("/solo/camera");
        }}
        onContinue={(shots) => {
          setSoloShots(shots);

          navigate("/solo/output");
        }}
      />
    );
  }

  if (route === "solo-output") {
    return (
      <SoloOutput
        shots={soloShots}
        selectedStrip="clean"
        onBack={() => {
          navigate("/solo/photobooth");
        }}
        onStartOver={handleSoloStartOver}
      />
    );
  }

  if (route === "pose-match-camera") {
    return (
      <SoloCamera
        onBack={handleBackHome}
        onContinue={(settings) => {
          setCameraSettings(settings);

          setSelectedPoseReferences([]);
          setPoseMatchShots([]);

          navigate("/pose-match/reference");
        }}
      />
    );
  }

  if (route === "pose-match-reference") {
    return (
      <PoseMatchReference
        selectedPoses={selectedPoseReferences}
        onBack={() => {
          navigate("/pose-match/camera");
        }}
        onContinue={(poses) => {
          setSelectedPoseReferences(poses);
          setPoseMatchShots([]);

          navigate("/pose-match/photobooth");
        }}
      />
    );
  }

  if (route === "pose-match-photobooth") {
    return (
      <PoseMatchPhotobooth
        cameraId={cameraSettings.cameraId}
        mirrored={cameraSettings.mirrored}
        selectedFilter="original"
        selectedStrip="clean"
        selectedPoses={selectedPoseReferences}
        initialShots={poseMatchShots}
        onBack={() => {
          navigate("/pose-match/reference");
        }}
        onContinue={(shots) => {
          setPoseMatchShots(shots);

          navigate("/pose-match/output");
        }}
      />
    );
  }

  if (route === "pose-match-output") {
    return (
      <PoseMatchOutput
        shots={poseMatchShots}
        selectedPoses={selectedPoseReferences}
        selectedStrip="clean"
        onBack={() => {
          navigate("/pose-match/photobooth");
        }}
        onStartOver={handlePoseMatchStartOver}
      />
    );
  }

  return (
    <Home
      onSoloContinue={handleSoloStart}
      onPoseMatchContinue={handlePoseMatchStart}
      onPokeFrameContinue={handlePokeFrameStart}
    />
  );
}

export default App;
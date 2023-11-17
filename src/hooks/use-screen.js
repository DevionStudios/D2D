import { useState } from "react";

import { error } from "../utils";

const useScreen = (stream) => {
  const [status, setStatus] = useState("idle");
  // (useState < "idle") | "loading" | "success" | ("rejected" > "idle");
  const [screenTrack, setScreenTrack] = useState(null);

  async function startShare(onstarted, onended) {
    setStatus("loading");

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const [screenTrack] = screenStream.getTracks();

      setScreenTrack(screenTrack);
      stream.addTrack(screenTrack);
      setStatus("success");

      onstarted();

      screenTrack.onended = () => {
        stopShare(screenTrack);
        onended();
      };
    } catch (e) {
      error("Failed to share screen")(e);
      setStatus("rejected");
    }
  }

  function stopShare(screenTrack) {
    screenTrack.stop();
    stream.removeTrack(screenTrack);
    setScreenTrack(null);
    setStatus("idle");
  }

  return {
    screenTrack,
    startShare,
    stopShare,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "rejected",
  };
};

export default useScreen;

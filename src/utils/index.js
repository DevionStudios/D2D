import { customAlphabet } from "nanoid";

function toggle(trackKind) {
  return (stream) => {
    const track = stream.getTracks().find((track) => track.kind == trackKind);

    if (track) track.enabled = !track.enabled;
  };
}

export const toggleVideo = toggle("video");
export const toggleAudio = toggle("audio");

export function formatTimeHHMM(milliseconds) {
  return new Date(milliseconds).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function createRoomId() {
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvxyz", 10);
  return nanoid();
}

export function createHost(roomId) {
  window.localStorage.setItem(roomId, "*");
}

export function append(appendant) {
  return (target) => {
    if (target instanceof Array) return target.concat(appendant);

    return { ...target, ...appendant };
  };
}

export function error(message) {
  return (error) => {
    console.error(message);
    console.error(error);
  };
}

export function isHost(roomId) {
  return typeof window !== "undefined" && !!window.localStorage.getItem(roomId);
}

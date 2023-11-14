import { useContext } from "react";

import { UsersStateContext } from "../../../context/users-settings";

import SharedScreen from "../../../components/Conference/shared-screen";

export default function SharedScreenStream({ sharedScreen, fullscreen }) {
  const { sharedScreenTrack } = useContext(UsersStateContext);
  const screenTrack = sharedScreen ?? sharedScreenTrack;

  return screenTrack ? (
    <div
      className={`flex justify-center ${
        fullscreen ? "basis-6/6" : "basis-5/6"
      }`}
    >
      <SharedScreen sharedScreenTrack={screenTrack} />
    </div>
  ) : null;
}

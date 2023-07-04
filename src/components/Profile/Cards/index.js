import { useState } from "react";
import Card from "./Card";
import axios from "axios";
import { useEffect } from "react";
function CardsLayout({ currentUser, user }) {
  const [activeTab, setActiveTab] = useState("Stamps");
  const [stamps, setStamps] = useState([]);
  const [ordinals, setOrdinals] = useState([]);
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  const handleStampsRequest = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/token/stamp/${user?.id}`
      );
      setStamps(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleOrdinalRequest = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/token/ordinal/${user?.id}`
      );
      setOrdinals(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleRequests = async () => {
    await handleStampsRequest();
    await handleOrdinalRequest();
  };
  useEffect(() => {
    handleRequests();
  });
  return (
    <div className="container mx-auto p-4 mt-14">
      <div className="flex justify-center mb-4">
        <button
          className={`py-2 px-4 rounded-md mr-2 w-30 ${
            activeTab === "Stamps"
              ? "bg-gradient-to-r from-orange-500 to-orange-300 text-white"
              : "bg-transparent"
          }`}
          onClick={() => handleTabChange("Stamps")}
        >
          Stamps
        </button>
        <button
          className={`py-2 px-4 rounded-md w-30 ${
            activeTab === "Ordinals"
              ? "bg-gradient-to-r from-orange-500 to-orange-300 text-white"
              : "bg-transparent"
          }`}
          onClick={() => handleTabChange("Ordinals")}
        >
          Ordinals and .Bitmap
        </button>
      </div>

      {activeTab === "Stamps" ? (
        <div className="bg-transparent p-4 grid lg:grid-cols-4 lg:gap-3 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-3">
          {stamps?.length <= 0
            ? "There Are No Stamps. Make Sure to Import Your Stamps By Going To Preferences in Settings"
            : stamps?.map((stamp, index) => {
                return <Card cardType={"stamps"} data={stamp} key={index} />;
              })}
          {/* <Card cardType={"stamps"} data={stamps} /> */}
        </div>
      ) : (
        <div className="bg-transparent p-4 grid lg:grid-cols-4 lg:gap-3 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-3">
          {ordinals?.length <= 0
            ? "There Are No Ordinals. Make Sure to Import Your Ordinals By Going To Preferences in Settings"
            : ordinals?.map((ordinal, index) => {
                return (
                  <Card cardType={"ordinals"} data={ordinal} key={index} />
                );
              })}
          {/* <Card cardType={"ordinals"} data={ordinals} /> */}
        </div>
      )}
    </div>
  );
}

export default CardsLayout;

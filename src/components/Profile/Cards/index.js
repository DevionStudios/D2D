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
    console.log("Stamp Address: ", user?.stampAddress);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/token/teststamp?hiroStampAddress=${user?.stampAddress}&unisatAddress=${user?.unisatAddress}`
      );
      setStamps(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleOrdinalRequest = async () => {
    console.log("Ordinal Address: ", user?.ordinalAddress);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/token/testordinal?hiroOrdinalAddress=${user?.ordinalAddress}&unisatAddress=${user?.unisatAddress}`
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
  }, [user]);
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
            ? "There Are No Stamps in the Wallet."
            : stamps?.map((stamp, index) => {
                return <Card cardType={"stamps"} data={stamp} key={index} />;
              })}
          {/* <Card cardType={"stamps"} data={stamps} /> */}
        </div>
      ) : (
        <div className="bg-transparent p-4 grid lg:grid-cols-4 lg:gap-3 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-3">
          {ordinals?.length <= 0
            ? "There Are No Ordinals in the Wallet."
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

import React, { useState } from "react";
import Foxxi from "../../assets/Foxxi Logo.png";
import Image from "next/image";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
const NFTComponent = ({ nft }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="bg-gradient-to-b h-64 w-64 from-yellow-300 to-orange-500 rounded-lg shadow-lg p-6 mt-3">
      <Image src={Foxxi} alt="Foxxi Logo" width={175} height={175} />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Foxxi</h3>
          <p className="text-sm text-white opacity-80">Description</p>
        </div>
        <button
          className={`flex items-center justify-center bg-white rounded-full w-10 h-10 ${
            liked ? "bg-red-500" : "text-gray-500"
          }`}
          onClick={handleLike}
        >
          {liked ? <HiHeart /> : <HiOutlineHeart />}
        </button>
      </div>
    </div>
  );
};

export default NFTComponent;

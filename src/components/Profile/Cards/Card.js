import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { HiHeart } from "react-icons/hi";
import { HiOutlineHeart } from "react-icons/hi";
import toast from "react-hot-toast";
function Card({ data, cardType }) {
  const [liked, setLiked] = useState(false);
  const [ordinalImageURL, setOrdinalImageURL] = useState("");

  const ordinalImageRequest = async () => {
    if (data.id) {
      try {
        const res = await axios.get(
          `https://api.hiro.so/ordinals/v1/inscriptions/${data.id}/content`
        );

        if (res.headers["content-type"].includes("image"))
          setOrdinalImageURL(
            `https://api.hiro.so/ordinals/v1/inscriptions/${data.id}/content`
          );
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    ordinalImageRequest();
  }, [data]);

  const handleLike = () => {
    setLiked(!liked);
  };
  const placeHolderStamp =
    "https://stampchain.io/stamps/fbea0e800473731b1f31e5f55000f3d5d5c1edf5fbdcb80ca31a9835103e246c.svg";
  const placeHolderOrdinal =
    "https://www.enbri.org/wp-content/themes/enbri/assets/images/no-image.png";
  return (
    <div className="max-w-xs rounded-lg overflow-hidden border border-yellow-200 bg-orange-200 bg-opacity-10">
      {cardType === "stamps" && (
        <div style={{ width: 300, height: "auto" }}>
          <div style={{ width: 300, height: "auto" }}>
            <Image
              src={
                cardType === "stamps"
                  ? data?.stamp_url || placeHolderStamp
                  : undefined
              }
              alt={
                cardType === "stamps" ? "Stamp Image" : "Ordinal Has No Image"
              }
              width={300}
              height={300}
            />
          </div>
        </div>
      )}
      {cardType === "ordinals" && (
        <div style={{ width: 300, height: "auto" }}>
          <div style={{ width: 300, height: "auto" }}>
            <Image
              src={ordinalImageURL || placeHolderOrdinal}
              alt={cardType === "ordinals" ? "Ordinal Image" : "No Image"}
              width={300}
              height={300}
            />
          </div>
        </div>
      )}
      <div className="bg-transparent">
        <div className="p-4">
          <div className="text-xs text-gray-800 dark:text-gray-300">
            {cardType === "stamps" ? (
              <p className="text-xs text-gray-800 dark:text-gray-300">
                <b
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(data?.stamp || "18527");
                    toast.success("Stamp Copied to Clipboard!");
                  }}
                >
                  stamp
                </b>
                : {data?.stamp || "18527"}
                <br />
                <b>tick</b>: {data?.tick || "KEVIN"}
                <br />
                <b
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(
                      data?.creator || "1BepCXzZ7RRcPaqUdvBp2jvkJcaRvHMGKz"
                    );
                    toast.success("Creator Copied to Clipboard!");
                  }}
                >
                  creator
                </b>
                :{" "}
                {data?.creator?.slice(0, 10) ||
                  "1BepCXzZ7RRcPaqUdvBp2jvkJcaRvHMGKz".slice(0, 10)}
                ...
                <br />
                <b
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(data?.op || "MINT");
                    toast.success("op Copied to Clipboard!");
                  }}
                >
                  op
                </b>
                : {data?.op || "MINT"}
                <br />
                <b
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(
                      data?.txHash ||
                        "fbea0e800473731b1f31e5f55000f3d5d5c1edf5fbdcb80ca31a9835103e246c"
                    );
                    toast.success("tx_hash Copied to Clipboard!");
                  }}
                >
                  tx_hash
                </b>
                :{" "}
                {data?.txHash?.slice(0, 10) ||
                  "fbea0e800473731b1f31e5f55000f3d5d5c1edf5fbdcb80ca31a9835103e246c".slice(
                    0,
                    10
                  )}
                ...
                <br />
                <b
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(data?.blockIndex || "788041");
                    toast.success("block_index Copied to Clipboard!");
                  }}
                >
                  block_index
                </b>
                : {data?.blockIndex || "788041"}
              </p>
            ) : (
              <div>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(
                      data?.id ||
                        "e7a3f454915f83f1d92ae18b98a76e8a1eabb383ffbbf87e139adb2f7a9bf7ebi0"
                    );
                    toast.success("Id Copied to Clipboard!");
                  }}
                >
                  <b>id</b>:{" "}
                  {data?.id?.slice(0, 10) ||
                    "e7a3f454915f83f1d92ae18b98a76e8a1eabb383ffbbf87e139adb2f7a9bf7ebi0".slice(
                      0,
                      10
                    )}
                  ...
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(data?.number);
                    toast.success(
                      "Number Copied to Clipboard!" ||
                        "bc1pfw38f2m955wrt878mx8qjw5547lfj8fqs96tz8a4jaf28a3n8epq97grlp"
                    );
                  }}
                >
                  <b>number</b>: {data.number || "5877614"}
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(
                      data?.address ||
                        "bc1pfw38f2m955wrt878mx8qjw5547lfj8fqs96tz8a4jaf28a3n8epq97grlp"
                    );
                    toast.success("Address Copied to Clipboard!");
                  }}
                >
                  <b>address</b>:{" "}
                  {data?.address?.slice(0, 10) ||
                    "bc1pfw38f2m955wrt878mx8qjw5547lfj8fqs96tz8a4jaf28a3n8epq97grlp".slice(
                      0,
                      10
                    )}
                  ...
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(
                      data?.genesisAddress ||
                        "bc1pfw38f2m955wrt878mx8qjw5547lfj8fqs96tz8a4jaf28a3n8epq97grlp"
                    );
                    toast.success("Genesis Address Copied to Clipboard!");
                  }}
                >
                  <b>genesis_address</b>:{" "}
                  {data?.genesisAddress?.slice(0, 10) ||
                    "bc1pfw38f2m955wrt878mx8qjw5547lfj8fqs96tz8a4jaf28a3n8epq97grlp".slice(
                      0,
                      10
                    )}
                  ...
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(
                      data?.txId ||
                        "e7a3f454915f83f1d92ae18b98a76e8a1eabb383ffbbf87e139adb2f7a9bf7eb"
                    );
                    toast.success("Transaction Id Copied to Clipboard!");
                  }}
                >
                  <b>tx_id</b>:{" "}
                  {data?.txId?.slice(0, 10) ||
                    "e7a3f454915f83f1d92ae18b98a76e8a1eabb383ffbbf87e139adb2f7a9bf7eb".slice(
                      0,
                      10
                    )}
                  ...
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(
                      data?.location ||
                        "e7a3f454915f83f1d92ae18b98a76e8a1eabb383ffbbf87e139adb2f7a9bf7eb:0:0"
                    );
                    toast.success("Location Copied to Clipboard!");
                  }}
                >
                  <b>location</b>:{" "}
                  {data?.location?.slice(0, 10) ||
                    "e7a3f454915f83f1d92ae18b98a76e8a1eabb383ffbbf87e139adb2f7a9bf7eb:0:0".slice(
                      0,
                      10
                    )}
                  ...
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(
                      data?.output ||
                        "e7a3f454915f83f1d92ae18b98a76e8a1eabb383ffbbf87e139adb2f7a9bf7eb:0"
                    );
                    toast.success("Output Copied to Clipboard!");
                  }}
                >
                  <b>output</b>:{" "}
                  {data?.output?.slice(0, 10) ||
                    "e7a3f454915f83f1d92ae18b98a76e8a1eabb383ffbbf87e139adb2f7a9bf7eb:0".slice(
                      0,
                      10
                    )}
                  ...
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(data?.value || "546");
                    toast.success("Value Copied to Clipboard!");
                  }}
                >
                  <b>value</b>: {data?.value || "546"}
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(data?.offset || "546");
                    toast.success("Offset Copied to Clipboard!");
                  }}
                >
                  <b>offset</b>: {data?.offset || "0"}
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(
                      data?.satOrdinal || "823985626681967"
                    );
                    toast.success("Set Ordinal Copied to Clipboard!");
                  }}
                >
                  <b>set_ordinal</b>:{" "}
                  {data?.satOrdinal?.toString()?.slice(0, 10) ||
                    "823985626681967"}
                  ...
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(data?.satRarity || "common");
                    toast.success("Set Rarity Copied to Clipboard!");
                  }}
                >
                  <b>set_rarity</b>: {data?.satRarity || "common"}
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(
                      data?.satCoinBaseHeight || "164797"
                    );
                    toast.success("Set Coin Base Height to Clipboard!");
                  }}
                >
                  <b>set_coin_base_height</b>:{" "}
                  {data?.satCoinBaseHeight || "164797"}
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(
                      data?.mimeType || "text/plain"
                    );
                    toast.success("Mime Type Copied to Clipboard!");
                  }}
                >
                  <b>mime_type</b>: {data?.mimeType || "text/plain"}
                </p>
                <p
                  className="text-xs text-gray-800 dark:text-gray-300 flex justify-start"
                  onClick={(e) => {
                    e.preventDefault();
                    // copy the id
                    navigator.clipboard.writeText(data?.contentLength || "13");
                    toast.success("Content Length Copied to Clipboard!");
                  }}
                >
                  <b>content_length</b>: {data?.contentLength || "13"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end mr-3">
        {/* <button
          className={`rounded-full p-3 mb-3 bg-orange-200`}
          onClick={handleLike}
        >
          {liked ? <HiHeart /> : <HiOutlineHeart />}
          {data?.likes?.length || 0}
        </button> */}
      </div>
    </div>
  );
}

export default Card;

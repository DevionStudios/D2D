import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import dotenv from "dotenv";
import FadeIn from "react-fade-in";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { BsPlusSquare } from "react-icons/bs";
import { AiFillInfoCircle } from "react-icons/ai";
import { HiClipboardCopy } from "react-icons/hi";
import "reactjs-popup/dist/index.css";
import { ErrorFallback } from "../ui/Fallbacks/ErrorFallback";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../ui/Button";
import Image from "next/image";

import Wizard from "../../assets/Wizard.png";
import { CreateChannelModal } from "./CreateChannelModal";

dotenv.config();

const Rootpage = ({ currentUser, communityName }) => {
  const [loading, setLoading] = useState(false);
  const [newMeetLoading, setNewMeetLoading] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [newId, setId] = useState("");
  const router = useRouter();

  // TODO: Remove static data
  const [data, setData] = useState([]);

  const validateMeet = async (meetId) => {
    try {
      const resData = await axios.put(
        process.env.NEXT_PUBLIC_BASE_URL + "api/community/moderator",
        { name: communityName }
      );
      const isAdmin = resData.data;
      setIsModerator(isAdmin);
    } catch (error) {
      toast.error("Oopsie 🤔 , There was an error.. Please reload", {
        style: {
          fontFamily: "Poppins",
        },
      });

      return false;
    }
  };

  const joinMeet = async (meetId) => {
    setNewMeetLoading(true);
    if (meetId === "") {
      toast.error("Oopsie 🤔 , Meet id can't be empty!", {
        style: {
          fontFamily: "Poppins",
        },
      });
      setNewMeetLoading(false);
      return;
    }

    // const isValidMeet = await validateMeet(meetId);

    // if (isValidMeet) {
    router.push(`/community/${communityName}/meeting/${meetId}`);
    // } else {
    //   toast.error("Oopsie 🤔 , Enter a valid meet id !", {
    //     style: {
    //       fontFamily: "Poppins",
    //     },
    //   });
    // }
    setNewMeetLoading(false);
  };

  const creatNewMeet = async () => {
    if (newId !== "") {
      toast.info("Psst 🤔 , You already generated a new id !", {
        style: {
          fontFamily: "Poppins",
        },
      });
      return;
    }
    setLoading(true);

    try {
      const channelId = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + "api/channel/id",
        {
          moderatorId: currentUser.id,
          communityId: currentUser.communityId,
        }
      );
      setId(channelId.data.id);
      toast("🚀 New channel created ", {
        style: {
          fontFamily: "Poppins",
          color: "black",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(
        "Some error occured 😢 . Try checking your internet connection",
        {
          style: {
            fontFamily: "Poppins",
            color: "black",
          },
        }
      );
    }
    setLoading(false);
  };

  //TODO
  const isModeratorCheck = async () => {
    try {
      const resData = await axios.put(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/community/moderator",
        { name: communityName },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      const isAdmin = resData.data;
      setIsModerator(isAdmin.isAdmin);
      console.log(isAdmin.isAdmin);
    } catch (error) {
      toast.error("Oopsie 🤔 , There was an error.. Please reload", {
        style: {
          fontFamily: "Poppins",
        },
      });

      return false;
    }
  };

  // TODO: Fetch all channels
  const getActiveChannels = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/channels/${communityName}`
      );
      setData(res.data);
    } catch (e) {
      console.log(e);
      toast.error("Some error occured 😢 . Cannot Fetch Existing Channels", {
        style: {
          fontFamily: "Poppins",
          color: "black",
        },
      });
    }
    setLoading(false);
  };
  const channels = data;

  useEffect(() => {
    isModeratorCheck();
    getActiveChannels();
  }, [data.length]);

  return (
    <>
      <CreateChannelModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentUser={currentUser}
        communityName={communityName}
      />
      <div className="w-screen overflow-auto" id="main-container">
        <div className="leading-normal tracking-normal text-indigo-400 bg-bg bg-center w-full h-full font-body ">
          <div className="container p-20 mx-auto flex flex-wrap flex-col md:flex-row items-center">
            <div className="w-full xl:w-3/5 p-10 overflow-hidden ">
              <h6 className="text-2xl md:text-4xl font-bold leading-tight text-center ">
                Join a channel
              </h6>
              <div className="dark:bg-gray-900 mt-10 ">
                <div className="flow-root mt-2 px-4 dark:bg-gray-900 text-center">
                  <ul role="list" className=" divide-y divide-gray-200">
                    {channels.length > 0 ? (
                      channels.map((edge, index) => {
                        const channel = edge;
                        if (channel) {
                          return (
                            <li key={channel.id} className="py-4 mx-6">
                              <div className="flex items-center justify-evenly space-x-4">
                                <div className="pt-0 min-w-0">
                                  <p className="text-md font-medium truncate">
                                    {index + 1}.
                                  </p>
                                </div>
                                <Link href="#" passHref>
                                  <div className="pt-2 flex-1 min-w-0">
                                    <p className="text-md font-medium truncate">
                                      {channel.name}
                                    </p>
                                  </div>
                                </Link>
                                <div className="pt-2 flex-1 min-w-0">
                                  <p className="text-md font-medium truncate">
                                    {channel.public ? "Public" : "Private"}
                                  </p>
                                </div>
                                <div>
                                  <Button
                                    currentUser={currentUser}
                                    isJoined={false}
                                    size="lg"
                                    onClick={() => {
                                      joinMeet(channel.id);
                                    }}
                                  >
                                    {newMeetLoading ? (
                                      <div className="w-8 h-8 mx-3 border-4 border-white rounded-full loader" />
                                    ) : (
                                      <span>Join</span>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </li>
                          );
                        }
                      })
                    ) : (
                      <ErrorFallback
                        action={() => router.back()}
                        message={`There are no active channels in this channel.`}
                        buttonText="Go back"
                      />
                    )}
                  </ul>
                </div>
              </div>
            </div>
            {isModerator ? (
              <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-hidden">
                <h1 className="text-2xl md:text-4xl font-bold leading-tight text-center ">
                  Create a channel
                </h1>
                <div className="md:w-full">
                  <form className="opacity-80 bg-opacity-75 bg-gray-900 rounded-lg shadow-inner md:w-full px-5 pt-6 pb-8 mb-4">
                    <div className="flex flex-row pt-2">
                      <div className="flex items-center justify-between">
                        <Button
                          className="text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                          type="button"
                          onClick={async () => {
                            setIsOpen(true);
                          }}
                        >
                          <div className="flex flex-row justify-center items-center gap-x-2 sm:gap-x-1">
                            {loading ? (
                              <div className="w-8 h-8 mx-3 border-4 border-white rounded-full loader" />
                            ) : (
                              <>
                                <BsPlusSquare size={18} />
                                <span>Create</span>
                              </>
                            )}
                          </div>
                        </Button>
                      </div>
                    </div>
                    {newId && (
                      <FadeIn>
                        <div className="flex flex-row justify-between text-md p-3 rounded-md shadow-inner my-6 bg-white">
                          <span>{newId ?? ""}</span>
                          <HiClipboardCopy
                            size={20}
                            className="cursor-pointer hover:text-blue-500"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(newId);
                                toast(" 🚀 Meeting id copied to clipboard ", {
                                  style: {
                                    fontFamily: "Poppins",
                                    color: "black",
                                  },
                                });
                              } catch (error) {
                                console.log(error);
                              }
                            }}
                          />
                        </div>
                        <span className="text-sm italic flex flex-row gap-x-1">
                          <AiFillInfoCircle size={18} />
                          Your friends join in with this id.
                        </span>
                      </FadeIn>
                    )}
                  </form>
                </div>
              </div>
            ) : (
              <div
                className="w-full xl:w-3/5 p-10 overflow-hidden "
                id="graphic"
              >
                <Image
                  className="mx-auto w-full md:w-3/5 transform -rotate-6 transition hover:scale-100 duration-700 ease-in-out hover:rotate-6 bg-collab"
                  alt="Together"
                  src={Wizard}
                />
              </div>
            )}
          </div>
          <ToastContainer autoClose={3000} hideProgressBar={false} />
        </div>
      </div>
    </>
  );
};

export { Rootpage };

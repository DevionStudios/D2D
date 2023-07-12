import { HiOutlineArrowRight } from "react-icons/hi";
import MergeImage from "../assets/merge.png";
import Image from "next/image";
export function Hero({ currentUser }) {
  const user = currentUser;
  return (
    //   <section className="antialiased h-full pt-6 bg-white bg-gradient-to-b from-white to-gray-200 dark:bg-gray-800 dark:bg-gradient-to-t dark:from-gray-800 dark:to-black">
    <section className="antialiased h-full pt-12 pt-sm-6">
      <div className="px-12 mx-auto max-w-7xl ">
        <div className="flex flex-col items-center w-full py-10 lg:space-x-10 lg:flex-row">
          <div className="relative z-10 w-full space-y-10 lg:w-full">
            <h1 className="text-4xl font-bold  sm:text-5xl xl:text-6xl tracking-tighter frontheader">
              <p className="gradient-text">World{"'"}s</p>
              <p>First Social Media App</p>
              build for Ordinals and Stamps
            </h1>
            <div className="flex flex-col items-center w-full space-x-5 lg:flex-row rounded-full">
              <a
                href={user?.id ? "/feed" : "/auth/walletsignup"}
                className="w-full rounded-full px-3 py-3 text-md font-medium text-center text-black bg-gradient-to-r from-orange-500 to-orange-300 shadow-xl xl:px-12 xl:text-lg lg:w-auto"
              >
                <span className="flex space-x-2 items-center justify-center">
                  {user && user.id ? (
                    <p>Go to your feed</p>
                  ) : (
                    <>
                      <p>Sign Up</p>{" "}
                    </>
                  )}
                </span>
              </a>
            </div>
          </div>
          <div className="mt-6">
            <Image
              src={MergeImage}
              alt="Picture of the author"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import clsx from "clsx";
import axios from "axios";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { Link } from "src/components/ui/Link";
import Logo from "../assets/D2D Logo Trans.png";
import { Button } from "src/components/ui/Button";
import { Heading } from "src/components/ui/Heading";
import { Step1 } from "src/components/Onboarding/Step1";
import { useMoralis } from "react-moralis";
import { toast } from "react-hot-toast";
import { Step2 } from "src/components/Onboarding/Step2";

const onboardingTabs = [
  {
    label: "Welcome",
    panel: <Step1 />,
    id: 0,
  },

  {
    label: "Your Profile",
    panel: <Step2 />,
    id: 2,
  },
];

export default function Onboarding({ currentUser }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(
    router.query.step ? parseInt(router.query.step) : 0
  );

  useEffect(() => {
    if (currentUser?.annonymous === true) {
      router.push("/auth/signin");
    }
  });
  const { account, deactivateWeb3 } = useMoralis();
  const [accountWallet, setAccountWallet] = useState(null);

  const sendSignInRequest = async () => {
    if (account == undefined) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/signin`,
        {
          accountWallet: account,
        },
        { withCredentials: true }
      );
      // !remove console.log(res.data);
      if (res.status == 200) {
        const jwtToken = "foxxi_jwt=" + res.data.jwt;
        document.cookie = jwtToken + ";path=/";
        toast.success("Signed In Successfully");
        router.push("/feed");
      } else {
        toast.error("Wallet is not registered! Please sign up first!");
        await deactivateWeb3();
        // clear all cookies
        document.cookie.split(";").forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
        router.push("/auth/walletsignin");
      }
    } catch (error) {
      toast.error("Wallet is not registered! Please sign up first!");
      await deactivateWeb3();
      // clear all cookies
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      router.push("/auth/walletsignin");
    }
  };
  useEffect(() => {
    if (!currentUser?.email && !currentUser?.annonymous) {
      if (!currentUser.accountWallet) {
        toast.error(
          "You are not signed in! You are being redirected to sign in page!"
        );
        router.push("/auth/walletsignin");
        return;
      }
      if (
        account &&
        currentUser.accountWallet &&
        account !== currentUser.accountWallet
      ) {
        toast.error("Detected Sign In With Different Wallet!");
        sendSignInRequest();
      }
    }
  }, [account]);
  function handleChange(idx) {
    setCurrentStep(idx);
    router.push(
      {
        pathname: "/onboarding",
        query: {
          step: idx.toString(), // update the query param
        },
      },
      undefined,
      { shallow: true }
    );
  }
  function handleNext() {
    setCurrentStep(currentStep + 1);
  }

  function handleBack() {
    setCurrentStep(currentStep - 1);
  }

  return (
    <div className="px-2 md:px-0 min-h-screen">
      <div className="fixed top-0 w-full z-50 bg-white dark:bg-gray-900">
        <div className="py-2 flex justify-center items-center">
          <Link href="/">
            <Image src={Logo} width={100} height={100} alt="Logo" />{" "}
          </Link>
          <Heading size="h5">Foxxi</Heading>
        </div>
        <div
          className={`w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5`}
        >
          <div
            className="bg-yellow-300 h-2.5 rounded-full"
            style={{
              width: currentStep === 0 ? `${100 / 2}%` : `${100 / 1}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="lg:px-8 mt-10 py-6 mx-auto w-full sm:py-6 lg:py-10 max-w-2xl ">
        <Tab.Group
          onChange={(idx) => handleChange(idx)}
          defaultIndex={currentStep}
        >
          <Tab.List
            className="-mb-px overflow-hideen border-b border-gray-200 dark:border-gray-800 relative z-0 rounded-lg shadow flex divide-x divide-gray-200 dark:divide-gray-600"
            aria-label="Tabs"
          >
            {onboardingTabs.map((step, tabIdx) => {
              return (
                <Tab
                  key={step.id}
                  className={clsx(
                    currentStep === step.id
                      ? "bg-brand-100 text-brand-700 dark:bg-gray-700 dark:text-yellow-300"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    tabIdx === 0 ? "rounded-l-lg" : "",
                    tabIdx === onboardingTabs.length - 1 ? "rounded-r-lg" : "",
                    "group relative min-w-0 flex-1  overflow-hidden bg-white dark:bg-gray-800 py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10"
                  )}
                >
                  <p className="text-base font-medium">{step.label}</p>
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels>
            {currentStep === 0 && <Step1 currentUser={currentUser} />}
            {currentStep === 1 && <Step2 currentUser={currentUser} />}
          </Tab.Panels>
        </Tab.Group>

        <div className="flex justify-between">
          {currentStep > 0 && (
            <Button
              onClick={handleBack}
              variant="dark"
              className="my-5"
              size="xl"
            >
              ← Previous
            </Button>
          )}
          {currentStep < onboardingTabs.length - 1 && (
            <Button onClick={handleNext} className="my-5 ml-auto" size="xl">
              Next →
            </Button>
          )}
          {currentStep === 2 && (
            <Button href="/feed" className="my-5 ml-auto" size="xl">
              Finish →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

//

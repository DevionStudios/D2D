import toast from "react-hot-toast";
import { z } from "zod";
import { Card } from "../ui/Card";
import Form, { useZodForm } from "../ui/Form/Form";
import FormSubmitButton from "../ui/Form/SubmitButton";
import { Input } from "../ui/Input";
import { Link } from "../ui/Link";
import { WalletAuthLayout } from "./WalletAuthLayout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

const WalletSignUpSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(2),
});

export function WalletSignUp() {
  const { account } = useMoralis();
  const [accountWallet, setAccountWallet] = useState(undefined);

  const form = useZodForm({
    schema: WalletSignUpSchema,
  });
  const router = useRouter();
  const processSignUp = async (values) => {
    if (accountWallet == undefined) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      let walletAddress;
      if (
        localStorage.getItem("walletType") == "metamask" ||
        localStorage.getItem("walletType") == undefined ||
        localStorage.getItem("walletType") == null
      ) {
        walletAddress = accountWallet;
        localStorage.setItem("walletAddress", accountWallet);
      } else walletAddress = localStorage.getItem("walletAddress");
      console.log(walletAddress);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/signup`,
        {
          accountWallet: walletAddress,
          name: values.name,
          username: values.username,
          walletType: localStorage.getItem("walletType"),
        },
        { withCredentials: true }
      );
      if (res.status == 201) {
        const jwtToken = "foxxi_jwt=" + res.data.jwt;
        document.cookie = jwtToken + ";path=/";
        toast.success("Account Created Successfully");
        localStorage.removeItem("walletType");
        router.push("/onboarding");
      } else {
        toast.error("Error Occured! Check If Wallet is already registered!");
      }
    } catch (error) {
      toast.error("Error Occured! Check If Wallet is already registered!");
    }
  };
  useEffect(() => {
    if (
      localStorage.getItem("walletType") == "metamask" ||
      localStorage.getItem("walletType") == undefined ||
      localStorage.getItem("walletType") == null
    )
      setAccountWallet(account);
    else setAccountWallet(localStorage.getItem("walletAddress"));
  }, [account]);
  return (
    <>
      <WalletAuthLayout
        title="Sign Up"
        subtitle="Sign up and join the Foxxi!"
        setAccount={setAccountWallet}
      >
        {accountWallet ? (
          <Form
            form={form}
            onSubmit={async (values) => {
              await processSignUp(values);
            }}
          >
            <Input
              label="Full Name"
              type="text"
              placeholder="Your Full Name"
              {...form.register("name")}
            />
            <Input
              label="Username"
              type="text"
              placeholder="Your Username (min 3)"
              {...form.register("username")}
            />
            <FormSubmitButton size="lg">Wallet Sign Up</FormSubmitButton>
          </Form>
        ) : null}
        <div>
          <Card rounded="lg" className="mt-4">
            <Card.Body>
              <span className="mr-1">Already have an account ?</span>
              <Link
                className="font-medium text-brand-600 hover:text-brand-400"
                href="/auth/walletsignin"
              >
                Log In Using Wallet
              </Link>
            </Card.Body>
          </Card>
          <Card rounded="lg" className="mt-4">
            <Card.Body>
              <span className="mr-1">Want to sign up using email?</span>
              <Link
                className="font-medium text-brand-600 hover:text-brand-400"
                href="/auth/signup"
              >
                Join Foxxi™
              </Link>
            </Card.Body>
          </Card>
        </div>
        <div>
          <Card rounded="lg" className="mt-4">
            <Card.Body>
              <span className="mr-1">Don’t want to join yet ?</span>
              <Link
                className="font-medium text-brand-600 hover:text-brand-400"
                href="/feed"
              >
                Browse Annonymously!
              </Link>
            </Card.Body>
          </Card>
        </div>
        <div></div>
      </WalletAuthLayout>
    </>
  );
}

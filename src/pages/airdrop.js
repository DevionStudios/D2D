import toast from "react-hot-toast";
import { object, z } from "zod";
import axios from "axios";

import { Navbar } from "src/components/Common/Navbar";
import { Card } from "src/components/ui/Card";
import Form, { useZodForm } from "src/components/ui/Form/Form";
import { Heading } from "src/components/ui/Heading";
import { Input } from "src/components/ui/Input";
import { TextArea } from "src/components/ui/TextArea";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { useEffect } from "react";
const EditProfileFormSchema = object({
  walletAddress: z.string().min(1, "Wallet Address must be provided."),
  message: z
    .string()
    .max(1000, "Exceeds 1000 characters. Consider keeping the message shorter.")
    .optional()
    .nullable(),
  email: z.string().email("Must be a valid email address."),
});

export default function AirdropPage({ currentUser }) {
  const router = useRouter();
  const { account, deactivateWeb3 } = useMoralis();

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
      let cookies = document?.cookie;
      // check if foxxi_user_wallet cookie exists
      let walletCookie = cookies
        ?.split("foxxi_user_wallet=")?.[1]
        ?.split(";")?.[0];
      if (walletCookie) {
        walletCookie = JSON.parse(walletCookie);
      }
      if (
        walletCookie?.activeWallet &&
        currentUser.accountWallet &&
        walletCookie?.activeWallet !== currentUser.accountWallet
      ) {
        // toast.error("Detected Sign In With Different Wallet!");
        // sendSignInRequest();
      }
      if (walletCookie?.activeWallet && currentUser.accountWallet) {
        toast.error("Detected Sign In With Different Wallet!");
        sendSignInRequest();
      }
    }
  }, [account]);
  const form = useZodForm({
    schema: EditProfileFormSchema,
    defaultValues: {},
  });

  const sendEmail = async ({ variables }) => {
    const { input } = variables;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/airdrop/request`,
        {
          email: input.email,
          walletAddress: input.walletAddress,
          message: input.message,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
    } catch (err) {
      toast.error("Could not send the email. Please try again.");
    }
  };

  return (
    <>
      <Navbar currentUser={currentUser} />
      <Card rounded="lg" className="lg:max-w-3xl mt-20">
        <Form
          form={form}
          onSubmit={async (values) => {
            const changedValues = Object.fromEntries(
              Object.keys(form.formState.dirtyFields).map((key) => [
                key,
                values[key],
              ])
            );

            const input = {
              ...changedValues,
              message: values.message,
            };
            await sendEmail({
              variables: { input },
            });
            form.reset();
            toast("Email sent updated successfully.");
          }}
        >
          <Card.Body>
            <Heading size="h3">Airdrop</Heading>
            <p className="text-muted text-sm">
              Send us your email address, wallet address and an optional message
              to receive your free Foxxi Tokens.
            </p>

            <div className="container pt-5 space-y-6 mx-auto">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Input
                    {...form.register("email")}
                    label="Email Address"
                    placeholder="Your Email Address"
                  />
                </div>
              </div>

              <div>
                <Input
                  {...form.register("walletAddress")}
                  placeholder="Enter your Wallet Address"
                  label="Wallet Address"
                />
              </div>
              <div>
                <TextArea
                  {...form.register("message")}
                  label="Message"
                  placeholder="Write your message"
                />
              </div>
            </div>
          </Card.Body>
          <Card.Footer className="flex justify-end">
            <Form.SubmitButton size="lg">Send Email</Form.SubmitButton>
          </Card.Footer>
        </Form>
      </Card>
    </>
  );
}

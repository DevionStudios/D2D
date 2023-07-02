import toast from "react-hot-toast";
import { z } from "zod";
import { Card } from "../ui/Card";
import Form, { useZodForm } from "../ui/Form/Form";
import FormSubmitButton from "../ui/Form/SubmitButton";
import { Input } from "../ui/Input";
import { Link } from "../ui/Link";
import { AuthLayout } from "./AuthLayout";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";

const SignUpSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  username: z.string().min(2),
  password: z.string(),
  verificationCode: z.string(),
});

export function SignUp() {
  const form = useZodForm({
    schema: SignUpSchema,
  });
  const router = useRouter();
  const [disableSendButton, setDisableSendButton] = useState(false);
  const [disableVerifyButton, setDisableVerifyButton] = useState(true);
  const [disableSendButtonFinal, setDisableSendButtonFinal] = useState(false);
  const processSignUp = async (values) => {
    //verify email first
    if (
      disableSendButton == false ||
      disableVerifyButton == false ||
      disableSendButtonFinal == false
    ) {
      return;
    }
    // validate password format
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
    if (!re.test(values.password)) {
      toast.error(
        "Password must be at least 4 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/signup`,
        {
          email: values.email,
          name: values.name,
          username: values.username,
          password: values.password,
        },
        { withCredentials: true }
      );
      if (res.status == 201) {
        const jwtToken = "foxxi_jwt=" + res.data.jwt;
        var date = new Date();
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
        document.cookie =
          jwtToken + ";expires=" + date.toUTCString() + ";path=/";
        toast.success("Account Created Successfully");
        router.push("/onboarding");
      } else {
        toast.error("Error Occured! Check If You Already Have An Account!");
      }
    } catch (error) {
      toast.error("Error Occured! Check If You Already Have An Account!");
    }
  };

  const sendVerificationCode = async () => {
    const { email } = form.getValues();
    var re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (!re.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/verification/generate`,
        { email: email },
        { withCredentials: true }
      );
      if (response.status == "200") {
        toast.success("Verification Code Sent");
        setDisableSendButton(true);
        setDisableVerifyButton(false);
      }
    } catch (e) {
      toast.error("Unable To Send Verification Code");
    }
  };

  const verifyVerificationCode = async () => {
    const { email, verificationCode } = form.getValues();
    var re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    if (!re.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/verification/compare`,
        { email: email, code: verificationCode },
        { withCredentials: true }
      );
      if (response.status == "200") {
        toast.success("Email Verified");
        setDisableVerifyButton(true);
        setDisableSendButtonFinal(true);
      }
    } catch (e) {
      toast.error("Please enter a valid code!");
    }
  };
  return (
    <AuthLayout title="Sign Up." subtitle="Sign up and join the Foxxi!">
      <Form
        form={form}
        onSubmit={async (values) => {
          await processSignUp(values);
        }}
      >
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          {...form.register("email")}
        />
        <Input
          label="Full Name"
          type="text"
          placeholder="Your Full Name"
          {...form.register("name")}
        />
        <Input
          label="Username"
          type="text"
          placeholder="Your Username (min 2)"
          {...form.register("username")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Your password (min 4)"
          {...form.register("password")}
        />
        <Input
          label="Verification Code"
          type="text"
          placeholder="Type Verification Code Here"
          {...form.register("verificationCode")}
          hidden={!disableSendButton}
        />
        {!(disableSendButton && disableVerifyButton) ? (
          <Button
            variant={disableSendButton ? "secondary" : "solid"}
            onClick={() => {
              sendVerificationCode();
            }}
            disabled={disableSendButtonFinal}
          >
            {disableSendButton ? "Resend Code" : "Send Code"}
          </Button>
        ) : null}
        {!(disableSendButton && disableVerifyButton) ? (
          <Button
            variant={disableVerifyButton ? "secondary" : "solid"}
            onClick={() => {
              verifyVerificationCode();
            }}
            disabled={disableVerifyButton}
          >
            Verify Code
          </Button>
        ) : null}
        <FormSubmitButton
          disabled={!(disableSendButton && disableVerifyButton)}
          size="lg"
        >
          Complete Sign Up
        </FormSubmitButton>
      </Form>
      <div>
        <Card rounded="lg" className="mt-4">
          <Card.Body>
            <span className="mr-1">Already have an account ?</span>
            <Link
              className="font-medium text-brand-600 hover:text-brand-400"
              href="/auth/signin"
            >
              Log into Foxxi™
            </Link>
          </Card.Body>
        </Card>
      </div>
      <div>
        <Card rounded="lg" className="mt-4">
          <Card.Body>
            <span className="mr-1">Already have an account ?</span>
            <Link
              className="font-medium text-brand-600 hover:text-brand-400"
              href="/auth/walletsignup"
            >
              Sign Up With Wallet
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
    </AuthLayout>
  );
}

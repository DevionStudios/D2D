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
  password: z.string(),
  verificationCode: z.string(),
});

export function PasswordReset() {
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
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/resetpassword`,
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      const jwtToken = "foxxi_jwt=" + res.data.jwt;
      var date = new Date();
      date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
      document.cookie = jwtToken + ";expires=" + date.toUTCString() + ";path=/";
      toast.success("Password Reset Successful!");
      router.push("/feed");
    } catch (error) {
      toast.error("Error Occured! Please retry!");
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
      console.log(response.data);
      toast.success("Verification Code Sent");
      setDisableSendButton(true);
      setDisableVerifyButton(false);
    } catch (e) {
      toast.error("Unable To Send Verification Code");
      console.log(e);
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
      console.log(response.data);
      if (response.status == "200") {
        toast.success("Email Verified");
        setDisableVerifyButton(true);
        setDisableSendButtonFinal(true);
      }
    } catch (e) {
      toast.error("Please enter a valid code!");
      console.log(e);
    }
  };
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Reset your password and signin!"
    >
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
        <Button
          variant={disableSendButton ? "secondary" : "solid"}
          onClick={() => {
            sendVerificationCode();
          }}
          disabled={disableSendButtonFinal}
        >
          {disableSendButton ? "Resend Code" : "Send Code"}
        </Button>
        <Button
          variant={disableVerifyButton ? "secondary" : "solid"}
          onClick={() => {
            verifyVerificationCode();
          }}
          disabled={disableVerifyButton}
        >
          Verify Code
        </Button>
        <FormSubmitButton
          disabled={!(disableSendButton && disableVerifyButton)}
          size="lg"
        >
          {disableSendButton && disableVerifyButton
            ? "Reset Password"
            : "Verify Email First"}
        </FormSubmitButton>
      </Form>

      <div>
        <Card rounded="lg" className="mt-4">
          <Card.Body>
            <span className="mr-1">Already have an account?</span>
            <Link
              className="font-medium text-brand-600 hover:text-brand-400"
              href="/auth/walletsignin"
            >
              Sign In With Wallet
            </Link>
          </Card.Body>
        </Card>
      </div>
    </AuthLayout>
  );
}

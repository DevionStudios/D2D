import { object, string } from "zod";
import { Input } from "../ui/Input";
import Form, { useZodForm } from "src/components/ui/Form/Form";
import { Link } from "../ui/Link";
import { AuthLayout } from "./AuthLayout";
import { Card } from "../ui/Card";
import toast from "react-hot-toast";
import FormSubmitButton from "../ui/Form/SubmitButton";
import axios from "axios";
import { useRouter } from "next/router";

const loginSchema = object({
  email: string().email(),
  password: string().min(4),
});

export function LoginForm() {
  const router = useRouter();
  const processSignIn = async (values) => {
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/signin`,
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );
      if (res.status == 200) {
        const jwtToken = "foxxi_jwt=" + res.data.jwt;
        var date = new Date();
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
        document.cookie =
          jwtToken + ";expires=" + date.toUTCString() + ";path=/";
        toast.success("Signed In Successfully");
        router.push("/feed");
      } else {
        toast.error("No User Found!");
      }
    } catch (error) {
      toast.error("No User Found!");
    }
  };
  const form = useZodForm({
    schema: loginSchema,
  });
  return (
    <AuthLayout
      title="Log In."
      subtitle="Welcome back! Log in to your Foxxi account."
    >
      <Form
        form={form}
        onSubmit={async (values) => {
          await processSignIn(values);
        }}
        className="w-full"
      >
        <Input
          label="Email"
          type="email"
          placeholder="Type your email here"
          autoComplete="email"
          autoFocus
          {...form.register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Type your password here"
          autoComplete="current-password"
          {...form.register("password")}
        />

        <FormSubmitButton size="lg">Login</FormSubmitButton>
      </Form>
      <div>
        <Card rounded="lg" className="mt-4">
          <Card.Body>
            <span className="mr-1">Don’t have an account yet ?</span>
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
            <span className="mr-1">Don’t have an account yet ?</span>
            <Link
              className="font-medium text-brand-600 hover:text-brand-400"
              href="/auth/walletsignin"
            >
              Log In With Wallet
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
      <div>
        <Card rounded="lg" className="mt-4">
          <Card.Body>
            <span className="mr-1">Forgot your Password ?</span>
            <Link
              className="font-medium text-brand-600 hover:text-brand-400"
              href="/auth/resetpassword"
            >
              Reset Password
            </Link>
          </Card.Body>
        </Card>
      </div>
    </AuthLayout>
  );
}

import router from "next/router";
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

const SignUpSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  username: z.string().min(3),
  password: z.string().min(4),
});

export function SignUp() {
  const form = useZodForm({
    schema: SignUpSchema,
  });
  const router = useRouter();
  const processSignUp = async (values) => {
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
        "http://localhost:5000/api/users/signup",
        {
          email: values.email,
          name: values.name,
          username: values.username,
          password: values.password,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      if (res.status == 201) {
        const jwtToken = "jwt=" + res.data.jwt;
        var date = new Date();
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
        document.cookie =
          jwtToken + ";expires=" + date.toUTCString() + ";path=/";
        toast.success("Account Created Successfully");
        router.push("/onboarding");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <AuthLayout
      title="Sign Up."
      subtitle="Sign up and join the Decentralised To Decentralised!"
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

        <Input
          label="Password"
          type="password"
          placeholder="Your password (min 4)"
          {...form.register("password")}
        />

        <FormSubmitButton size="lg">Sign Up</FormSubmitButton>
      </Form>
      <div>
        <Card rounded="lg" className="mt-4">
          <Card.Body>
            <span className="mr-1">Already have an account ?</span>
            <Link
              className="font-medium text-brand-600 hover:text-brand-400"
              href="/auth/signin"
            >
              Log into D2D™
            </Link>
          </Card.Body>
        </Card>
      </div>
    </AuthLayout>
  );
}

import router from "next/router";
import toast from "react-hot-toast";
import { z } from "zod";
import { Card } from "../ui/Card";
import Form, { useZodForm } from "../ui/Form/Form";
import FormSubmitButton from "../ui/Form/SubmitButton";
import { Input } from "../ui/Input";
import { Link } from "../ui/Link";
import { AuthLayout } from "./AuthLayout";
const SignUpSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  username: z.string().min(3),
  password: z.string().min(6),
});

export function SignUp() {
  const signup = async () => {};
  const form = useZodForm({
    schema: SignUpSchema,
  });

  return (
    <AuthLayout
      title="Sign Up."
      subtitle="Sign up and join the Decentralised To Decentralised!"
    >
      <Form form={form} onSubmit={async (values) => {}}>
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
          placeholder="Your Username"
          {...form.register("username")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Your password (min 6)"
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

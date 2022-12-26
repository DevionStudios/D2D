import { object, string } from "zod";
import { Input } from "../ui/Input";
import Form, { useZodForm } from "~/components/ui/Form/Form";
import { Link } from "../ui/Link";
import { AuthLayout } from "./AuthLayout";
import { Card } from "../ui/Card";
import toast from "react-hot-toast";
import FormSubmitButton from "../ui/Form/SubmitButton";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";


const loginSchema = object({
  email: string().email(),
  password: string().min(6),
});

export function LoginForm() {
  const form = useZodForm({
    schema: loginSchema,
  });
  return (
    <AuthLayout
      title="Sign In."
      subtitle="Welcome back! Sign in to your Decentralised To Decentralised account."
    >
      <Form
        form={form}
        onSubmit={async ({ email, password }) => {}}
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
              Join D2D™
            </Link>
          </Card.Body>
        </Card>
      </div>
    </AuthLayout>
  );
}

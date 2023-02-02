import toast from "react-hot-toast";
import { object, z } from "zod";
import { Card } from "src/components/ui/Card";
import Form, { useZodForm } from "../ui/Form/Form";
import { Heading } from "../ui/Heading";
import { Input } from "../ui/Input";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import axios from "axios";
import { useEffect, useState } from "react";

const PasswordResetSchema = object({
  oldPassword: z.string().nonempty("Current password is required."),
  newPassword: z
    .string()
    .min(4, "Password should be atleast 4 characters long.")
    .max(334, "Your password is a bit long."),
  confirm: z.string(),
}).refine((data) => data.newPassword === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"], // path of error
});

export function PasswordTab() {
  const [loading, setLoading] = useState(false);

  const form = useZodForm({
    schema: PasswordResetSchema,
  });
  const changePassword = async ({ variables }) => {
    // change password request
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/updatepassword`,
        {
          oldPassword: variables.input.oldPassword,
          newPassword: variables.input.newPassword,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
    } catch (e) {
      // console.log(e);
    }
  };

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <>
      <Card rounded="lg" className="lg:max-w-3xl">
        <Form
          form={form}
          onSubmit={async (values) => {
            await changePassword({
              variables: {
                input: {
                  newPassword: values.newPassword,
                  oldPassword: values.oldPassword,
                },
              },
            });
            toast("Your password has been changed.");
          }}
        >
          <Card.Body>
            <Heading size="h3">Security Settings</Heading>
            <p className="text-muted text-sm">
              You can change your password or update your email address here.
            </p>

            <div className="container pt-5 space-y-6 mx-auto">
              <div className="space-y-4">
                <div>
                  <Input
                    label="Current Password"
                    {...form.register("oldPassword")}
                    type="password"
                    placeholder="Your current password"
                  />
                </div>
                <div>
                  <Input
                    label="New Password"
                    {...form.register("newPassword")}
                    type="password"
                    placeholder="Your new password"
                  />
                </div>
                <div>
                  <Input
                    label="Confirm New Password"
                    {...form.register("confirm")}
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          </Card.Body>
          <Card.Footer className="flex justify-end">
            <Form.SubmitButton size="lg">Save</Form.SubmitButton>
          </Card.Footer>
        </Form>
      </Card>
    </>
  );
}

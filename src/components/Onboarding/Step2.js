import toast from "react-hot-toast";
import { z } from "zod";
import { Card } from "../ui/Card";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import { FileInput } from "../ui/Form/FileInput";
import Form, { useZodForm } from "../ui/Form/Form";
import { TextArea } from "../ui/TextArea";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Input } from "../ui/Input";
const ProfileFormSchema = z.object({
  bio: z
    .string()
    .max(400, "Exceeds 400 characters. Consider keeping bio shorter.")
    .optional()
    .nullable(),
  image: z.any().optional(),
  coverImage: z.any().optional(),
  walletAddress: z.string().optional().nullable(),
});

export function Step2({ currentUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = currentUser || {};
  const form = useZodForm({
    schema: ProfileFormSchema,
    defaultValues: {
      bio: user.bio || "",
      walletAddress: user.walletAddress || "",
    },
  });
  const updateProfile = async ({ variables }) => {
    const { input } = variables;
    const formdata = new FormData();
    formdata.append("bio", input.bio || user.bio);
    formdata.append("image", input.image);
    formdata.append("coverImage", input.coverImage);
    formdata.append("name", user.name);
    formdata.append("username", user.username);
    formdata.append("walletAddress", input.walletAddress || user.walletAddress);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/update`,
        formdata,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
    } catch (e) {
      // !remove console.log(e);
    }
  };
  return (
    <Card className="space-y-4 my-6 overflow-hidden" rounded="lg">
      <Card.Body className="space-y-1">
        <div className="text-2xl font-bold">Your profile</div>
        <div className="text-gray-500">
          Tell us a little bit about yourself — this is how others will see you
          on Foxxi. You’ll always be able to edit this later in your Settings.
        </div>
      </Card.Body>
      <Form
        form={form}
        onSubmit={async (values) => {
          setLoading(true);
          const changedValues = Object.fromEntries(
            Object.keys(form.formState.dirtyFields).map((key) => [
              key,
              values[key],
            ])
          );

          const input = {
            ...changedValues,
            image: values.image?.[0] || user.image,
            coverImage: values.coverImage?.[0] || user.coverImage,
          };

          await updateProfile({
            variables: { input },
          });

          toast.success("Profile updated successfully.");
          // After updating profile setLoading To false
          setLoading(false);
        }}
      >
        <div className="flex space-x-3 px-5">
          <div className="flex-[0.3]">
            <FileInput
              existingimage={user.image}
              name="image"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              multiple={false}
            />
          </div>
          <div className="flex-[0.7] ">
            <FileInput
              existingimage={user.coverImage}
              accept="image/png, image/jpg, image/jpeg, image/gif"
              name="coverImage"
              label="Cover image"
              multiple={false}
            />
          </div>
        </div>
        <div className="px-5 py-10">
          <Input
            {...form.register("walletAddress")}
            label="Airdrop Address"
            placeholder="Your Wallet Address"
          />
        </div>
        <div className="px-5 py-10">
          <TextArea
            {...form.register("bio")}
            label="Bio"
            placeholder="Write a few lines about yourself."
          />
        </div>
        <Card.Footer className="flex flex-row-reverse">
          <Form.SubmitButton>Save</Form.SubmitButton>
        </Card.Footer>
      </Form>
      {loading && <LoadingFallback />}
    </Card>
  );
}

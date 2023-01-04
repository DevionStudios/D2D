import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { object, z } from "zod";
import axios from "axios";

import { Card } from "../ui/Card";
import { LoadingFallback } from "../ui/Fallbacks/LoadingFallback";
import { FileInput } from "../ui/Form/FileInput";
import Form, { useZodForm } from "../ui/Form/Form";
import { Heading } from "../ui/Heading";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";

const EditProfileFormSchema = object({
  username: z
    .string()
    .min(4, "Username is too short")
    .max(15, "Username is too long. Consider making it shorter.")
    .optional(),
  name: z
    .string()
    .min(1, "Name must be longer than one character.")
    .max(30, "Consider putting a shorter first name."),
  twitterUsername: z
    .string()
    .min(1, "Name must be longer than one character.")
    .max(30, "Consider putting a shorter first name."),
  bio: z
    .string()
    .max(400, "Exceeds 400 characters. Consider keeping bio shorter.")
    .optional()
    .nullable(),
  email: z.string().email("Must be a valid email address."),
  walletAddress: z.string().optional().nullable(),
  avatar: z.any().optional(),
  coverImage: z.any().optional(),
});

export function EditProfileTab({ currentUser }) {
  const [loading, setLoading] = useState(false);

  // fetch user data before rendering
  const [user, setUser] = useState({
    username: "azulul",
    name: "Azulul Mobius",
    bio: "I am a gamer",
    email: "azulul@gmail.com",
    walletAddress: "0x0000000000000000dEaD",
    twitterUsername: "azulul",
  });

  const form = useZodForm({
    schema: EditProfileFormSchema,
    defaultValues: {
      username: user.username,
      bio: user.bio,
      name: user.name,
      email: user.email,
      walletAddress: user.walletAddress,
    },
  });

  useEffect(() => {
    setUser(currentUser);

    form.reset({
      username: currentUser.username,
      bio: currentUser.bio,
      name: currentUser.name,
      email: currentUser.email,
      walletAddress: currentUser.walletAddress,
      twitterUsername: currentUser.twitterUsername,
    });
  }, [currentUser]);

  if (loading) {
    return <LoadingFallback />;
  }

  const updateProfile = async ({ variables }) => {
    console.log(variables);
    const { input } = variables;
    const images = [input.image, input.coverImage];
    const formdata = new FormData();
    formdata.append("bio", input.bio || user.bio);
    formdata.append("images", input.image);
    formdata.append("images", input.coverImage);
    formdata.append("name", input.name || user.name);
    formdata.append("username", input.username || user.username);
    formdata.append("walletAddress", input.walletAddress || user.walletAddress);
    formdata.append(
      "twitterUsername",
      input.twitterUsername || user.twitterUsername
    );
    console.log("Cookie: ", document.cookie);
    try {
      const res = await axios.put(
        "https://foxxi-backend.onrender.com/api/users/update",
        formdata,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Card rounded="lg" className="lg:max-w-3xl">
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
            avatar: values?.image?.[0],
            coverImage: values?.coverImage?.[0],
            bio: values.bio,
          };
          console.log(input);
          await updateProfile({
            variables: { input },
          });

          toast("Profile updated successfully.");
        }}
      >
        <Card.Body>
          <Heading size="h3">Profile</Heading>
          <p className="text-muted text-sm">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="container pt-5 space-y-6 mx-auto">
            <div className="flex space-x-3 ">
              <div className="flex-[0.3]">
                <FileInput
                  existingimage={user.image}
                  name="avatar"
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  multiple={false}
                />
              </div>
              <div className="flex-[0.7]">
                <FileInput
                  existingimage={user.coverImage}
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  name="coverImage"
                  label="Cover Image"
                  multiple={false}
                />
              </div>
            </div>
            <div>
              <Input
                {...form.register("username")}
                label="Username"
                placeholder="Your username"
                prefix="Foxxi.com/@"
              />
            </div>
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  {...form.register("name")}
                  label="Full Name"
                  placeholder="Your Full Name"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  {...form.register("twitterUsername")}
                  label="Username on Twitter (Cannot be changed once set)"
                  placeholder="You cannot change this later"
                />
              </div>
            </div>
            <div>
              <Input
                {...form.register("email")}
                readOnly
                label="Email Address"
              />
            </div>
            <div>
              <Input
                {...form.register("walletAddress")}
                placeholder="Enter your Wallet Address."
                label="Wallet Address"
              />
            </div>
            <div>
              <TextArea
                {...form.register("bio")}
                label="Bio"
                placeholder="Write a few lines about yourself."
              />
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="flex justify-end">
          <Form.SubmitButton size="lg">Save</Form.SubmitButton>
        </Card.Footer>
      </Form>
    </Card>
  );
}

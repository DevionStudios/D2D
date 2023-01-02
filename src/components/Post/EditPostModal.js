import { useEffect } from "react";
import toast from "react-hot-toast";
import { object, z } from "zod";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import Form, { useZodForm } from "../ui/Form/Form";
import { Heading } from "../ui/Heading";
import Modal from "../ui/Modal";
import { TextArea } from "../ui/TextArea";
import axios from "axios";

const EditPostSchema = object({
  caption: z.string().nonempty("Caption is required.").max(420),
});
export function EditPost({ isOpen, onClose, id, caption, gifLink }) {
  const editPost = async (values) => {
    const { caption } = values;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/edit/${id}`,
        { caption },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const form = useZodForm({
    schema: EditPostSchema,
  });

  useEffect(() => {
    form.reset({
      caption: caption,
    });
  }, [form]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-lg">
      <Modal.Header dismiss>
        <Heading size="h4">Edit Post</Heading>
      </Modal.Header>
      <Card.Body noPadding className="mt-4">
        <Form
          form={form}
          onSubmit={async (values) => {
            await editPost(values);
            onClose();
            toast("Post caption has been edited successfully.");
            window.location.reload();
          }}
        >
          <TextArea
            label="Caption"
            placeholder="Include body for your post."
            {...form.register("caption")}
          />

          <div className="flex justify-end space-x-3">
            <Button type="button" onClick={onClose} size="lg" variant="dark">
              Cancel
            </Button>
            <Form.SubmitButton size="lg">Save Edit</Form.SubmitButton>
          </div>
        </Form>
      </Card.Body>
    </Modal>
  );
}

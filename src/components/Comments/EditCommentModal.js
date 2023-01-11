import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import Form, { useZodForm } from "../ui/Form/Form";
import { Heading } from "../ui/Heading";
import Modal from "../ui/Modal";
import { TextArea } from "../ui/TextArea";

const EditCommentSchema = z.object({
  caption: z.string().min(1, "Comment should consist atleast one character."),
});

export function EditCommentModal({ isOpen, onClose, id, caption, postId }) {
  const form = useZodForm({
    schema: EditCommentSchema,
  });
  const editComment = async ({ caption }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/update`,
        {
          caption: caption,
          id: id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      toast.success("Comment has been edited.");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    form.reset({
      caption,
    });
  }, [form, caption]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-lg">
      <Modal.Header dismiss>
        <Heading size="h4">Edit Comment</Heading>
      </Modal.Header>
      <Card.Body noPadding className="mt-4">
        <Form
          form={form}
          onSubmit={async (values) => {
            await editComment({
              caption: values.caption,
            });
            onClose();
          }}
        >
          <TextArea
            label="Comment"
            placeholder="Edit your comment."
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

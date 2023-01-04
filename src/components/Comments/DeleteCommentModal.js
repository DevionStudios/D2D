import toast from "react-hot-toast";
import axios from "axios";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Heading } from "../ui/Heading";
import Modal from "../ui/Modal";

export function DeleteCommentModal({ id, isOpen, onClose, postId }) {
  console.log("Comment Id: ", id);
  const deleteComment = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/comments/delete/${id}`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );

      console.log("Response: ", response);
      toast.success("Comment has been deleted.");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-lg">
      <Modal.Header dismiss>
        <Heading size="h4">Delete Comment?</Heading>
        <p className="text-sm text-muted">This action cannot be undone.</p>
      </Modal.Header>
      <Card.Body noPadding className="mt-4">
        <div className="flex justify-end space-x-3">
          <Button type="button" onClick={onClose} size="lg" variant="dark">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await deleteComment();
              onClose();
            }}
            size="lg"
          >
            Confirm Delete
          </Button>
        </div>
      </Card.Body>
    </Modal>
  );
}

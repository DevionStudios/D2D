import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Heading } from "../ui/Heading";
import Modal from "../ui/Modal";
import axios from "axios";

export function DeletePostModal({ isOpen, onClose, id }) {
  const deletePost = async () => {
    try {
      const response = await axios.delete(
        "${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/delete/" + id,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      console.log(response.data);
      onClose();
      toast.success("Requested post has been deleted.");
    } catch (e) {
      toast.error("There was some error when deleting post.");
      console.log(e);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="sm:max-w-lg">
      <Modal.Header dismiss>
        <Heading size="h4">Delete Post?</Heading>
        <p className="text-sm text-muted">This action cannot be undone.</p>
      </Modal.Header>
      <Card.Body noPadding className="mt-4">
        <div className="flex justify-end space-x-3">
          <Button type="button" onClick={onClose} size="lg" variant="dark">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await deletePost();
              window.location.reload(false);
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

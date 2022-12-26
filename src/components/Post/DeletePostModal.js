import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Heading } from "../ui/Heading";
import Modal from "../ui/Modal";

let DELETE_POST_MUTATION;

export function DeletePostModal({ isOpen, onClose, id }) {
  let deletePost;

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
              const response = await deletePost({ variables: { id } });
              if (response.data?.deletePost.success) {
                onClose();
                toast.success("Requested post has been deleted.");
              }
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

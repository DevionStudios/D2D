import {
  HiOutlineDotsVertical,
  HiOutlineFlag,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { EditPost } from "./EditPostModal";
import { Menu, MenuItem } from "../ui/Dropdown";
import { DeletePostModal } from "./DeletePostModal";

export function PostDropdown({
  id,
  caption,
  isMine,
  gifLink,
  currentUser,
  post,
}) {
  const [editPostModal, setEditPostModal] = useState(false);
  const [deletePostModal, setDeletePostModal] = useState(false);

  console.log("post", post.originalPostId);

  const reportPost = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/report`,
        {
          postId: id,
        },
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Post reported");
      } else {
        toast.error("You have already reported this post");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to report post");
    }
  };

  return (
    <div>
      <EditPost
        id={id}
        isOpen={editPostModal}
        onClose={() => setEditPostModal(false)}
        caption={caption}
        gifLink={gifLink}
      />
      <DeletePostModal
        isOpen={deletePostModal}
        onClose={() => setDeletePostModal(false)}
        id={id}
      />
      <Menu
        dropdown={
          <>
            {isMine && post?.originalPostId?.length <= 0 && (
              <MenuItem
                icon={<HiOutlinePencil />}
                onClick={() => setEditPostModal(true)}
              >
                Edit
              </MenuItem>
            )}

            {isMine && (
              <MenuItem
                onClick={() => setDeletePostModal(true)}
                icon={<HiOutlineTrash />}
              >
                Delete Post
              </MenuItem>
            )}

            {!isMine && currentUser.anonymous !== true && (
              <MenuItem onClick={() => reportPost()} icon={<HiOutlineFlag />}>
                Report Post
              </MenuItem>
            )}
          </>
        }
      >
        <span className="-m-2 p-2 rounded-full flex items-center dark:hover:bg-gray-700 hover:bg-gray-300">
          <HiOutlineDotsVertical className="w-5 h-5" />
        </span>
      </Menu>
    </div>
  );
}

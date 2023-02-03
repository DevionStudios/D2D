import { Notification, NotificationType } from "./Notification";
import { Overlay } from "../Overlay";
import { useEffect } from "react";
import Spinner from "../Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { ErrorFallback } from "../Fallbacks/ErrorFallback";
import axios from "axios";
import { useState } from "react";
import { Button } from "../Button";
import { toast } from "react-hot-toast";
export function NotificationOverlay({ open, setOpen, setHasNotification }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification/get`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      setData(response.data.data);
      setHasNotification(response.data.data.length > 0 ? true : false);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const deleteNotifications = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification/delete`,
        {
          headers: {
            cookies: document.cookie,
          },
        }
      );
      setData([]);
      setHasNotification(false);
      toast.success("Notifications cleared");
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <Overlay open={open} setOpen={setOpen} overlayTitle="Notifications">
      <div
        className=" bg-brand-50 dark:bg-gray-900 overflow-y-auto w-full px-4 absolute right-0"
        style={{ height: "80vh" }}
      >
        {data && data.length > 0 ? (
          <InfiniteScroll
            dataLength={data.length}
            loader={<Spinner className="w-5 h-5" />}
          >
            {data.map((notification, index) => {
              return <Notification key={index} notification={notification} />;
            })}
            <Button
              className="mt-5"
              onClick={async () => {
                await deleteNotifications();
              }}
            >
              Clear
            </Button>
          </InfiniteScroll>
        ) : (
          <>
            {loading ? (
              <Spinner className="w-5 h-5" />
            ) : (
              <ErrorFallback
                noAction
                message="No notifications for now. All caught up!"
              />
            )}
          </>
        )}
      </div>
    </Overlay>
  );
}

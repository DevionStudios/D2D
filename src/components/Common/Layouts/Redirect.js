import { useRouter } from "next/router";
import { useEffect } from "react";

export function Redirect({ pageName }) {
  const router = useRouter();
  useEffect(() => {
    router.push(`/${pageName}`);
  }, []);
}

/*eslint no-mixed-spaces-and-tabs: ["error", "smart-tabs"]*/

import { ComponentPropsWithRef, forwardRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const ButtonOrLink = forwardRef(({ href, preserveRedirect, ...props }, ref) => {
  const router = useRouter();
  const isLink = typeof href !== "undefined";
  const ButtonOrLink = isLink ? "a" : "button";

  const content = <ButtonOrLink ref={ref} {...props} />;

  if (isLink) {
    const finalHref =
      preserveRedirect && router.query.redirect
        ? `${href}?redirect=${encodeURIComponent(router.query.redirect)}`
        : href;

    return <Link href={finalHref}>{content}</Link>;
  }

  return content;
});

ButtonOrLink.displayName = "ButtonOrLink";
export default ButtonOrLink;

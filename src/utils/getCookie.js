export const getCookie = (doc) => {
  let cookies = doc?.cookie;
  // check if foxxi_jwt cookie exists
  let cookie = cookies?.split("foxxi_jwt=")?.[1]?.split(";")?.[0];
  if (cookie) {
    return cookie;
  } else {
    return null;
  }
};

export const getWalletCookie = (document) => {
  let cookies = document?.cookie;
  // check if foxxi_user_wallet cookie exists
  let cookie = cookies?.split("foxxi_user_wallet=")?.[1]?.split(";")?.[0];
  if (cookie) {
    cookie = JSON.parse(cookie);
    return cookie;
  } else {
    return null;
  }
};
export const resetWalletCookie = (document) => {
  // delete wallet cookie
  setWalletCookie(document, {
    activeWallet: undefined,
    ordinalWalletAddress: undefined,
    stampWalletAddress: undefined,
  });
};
export const setWalletCookie = (
  document,
  { activeWallet, ordinalWalletAddress, stampWalletAddress }
) => {
  let cookies = document?.cookie;
  // "foxxi_jwt="
  // take the foxxi_jwt cookie as it is without using split
  let jwt = cookies?.split("foxxi_jwt=")?.[1]?.split(";")?.[0];
  jwt = jwt ? `foxxi_jwt=${jwt};` : "";
  // check if foxxi_user_wallet cookie exists
  let cookie = cookies.split("foxxi_user_wallet=")?.[1]?.split(";")?.[0];
  if (cookie) {
    cookie = JSON.parse(cookie);
    cookie = {
      activeWallet: activeWallet,
      ordinalWalletAddress: ordinalWalletAddress,
      stampWalletAddress: stampWalletAddress,
    };
    document.cookie =
      jwt + `foxxi_user_wallet=${JSON.stringify(cookie)};path=/`;
  } else {
    cookie = {
      activeWallet,
      ordinalWalletAddress,
      stampWalletAddress,
    };
    document.cookie =
      jwt + `foxxi_user_wallet=${JSON.stringify(cookie)};path=/`;
  }
};

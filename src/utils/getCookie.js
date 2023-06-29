export const getCookie = (doc, name) => {
  let cookies = doc.cookie;
  let prefix = name + "=";
  let cookie = cookies.split(";").find((c) => c.trim().startsWith(prefix));
  if (cookie) {
    return cookie.split("=")[1].split(";")[0];
  }
  return null;
};

export const getWalletCookie = (document) => {
  let cookies = document.cookie;
  // check if foxxi_user_wallet cookie exists
  let cookie = cookies.split("foxxi_user_wallet=")?.[1]?.split(";")?.[0];
  if (cookie) {
    cookie = JSON.parse(cookie);
    return cookie;
  } else {
    return null;
  }
};

export const setWalletCookie = (
  document,
  { activeWallet, hiroWallet, dogeWallet, wallectConnectWallet, unisatWallet }
) => {
  let cookies = document.cookie;
  // check if foxxi_user_wallet cookie exists
  let cookie = cookies.split("foxxi_user_wallet=")?.[1]?.split(";")?.[0];
  if (cookie) {
    cookie = JSON.parse(cookie);
    cookie = {
      activeWallet: cookie?.activeWallet || activeWallet,
      hiroWallet: cookie?.hiroWallet || hiroWallet,
      unisatWallet: cookie?.unisatWallet || unisatWallet,
      dogeWallet: cookie?.dogeWallet || dogeWallet,
      wallectConnectWallet:
        cookie?.wallectConnectWallet || wallectConnectWallet,
    };
    document.cookie = `foxxi_user_wallet=${JSON.stringify(cookie)};path=/`;
  } else {
    cookie = {
      activeWallet,
      dogeWallet,
      wallectConnectWallet,
      unisatWallet,
      hiroWallet,
    };
    document.cookie = `foxxi_user_wallet=${JSON.stringify(cookie)};path=/`;
  }
};

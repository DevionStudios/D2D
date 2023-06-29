import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeWallet: undefined,
  bitcoinWallet: undefined,
  walletConnectWallet: undefined,
  dogeWallet: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setActiveWallet: (state, action) => {
      state.activeWallet = action.payload;
    },

    setBitcoinWallet: (state, action) => {
      state.bitcoinWallet = action.payload;
    },

    setDogeWallet: (state, action) => {
      state.dogeWallet = action.payload;
    },
    setWalletConnectWallet: (state, action) => {
      state.walletConnectWallet = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setActiveWallet,
  setBitcoinWallet,
  setDogeWallet,
  setWalletConnectWallet,
} = authSlice.actions;

export default authSlice.reducer;

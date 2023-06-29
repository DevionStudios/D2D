import { useDispatch } from "react-redux";
import { store } from "./store";

export const useCustomDispatch = () => useDispatch(store);

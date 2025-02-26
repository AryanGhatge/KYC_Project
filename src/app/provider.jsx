"use client";

import { Provider } from "react-redux";
import { store } from "./store/index";
// import { SessionProvider } from "next-auth/react";

export function Providers({ children }) {
  return (
    // <SessionProvider>
    <Provider store={store}>{children}</Provider>
    // </SessionProvider>
  );
}

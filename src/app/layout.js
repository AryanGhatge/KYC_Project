import { Inter } from "next/font/google";
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Providers } from "./store/provider";
import "@mantine/core/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KYC",
  description:
    "The traditional KYC (Know Your Customer) process involves multiple manual steps and interactions, which can be time-consuming and cumbersome for both customers and institutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider>
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}

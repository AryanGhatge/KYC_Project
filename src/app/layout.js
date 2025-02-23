import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KYC",
  description:
    "The traditional KYC (Know Your Customer) process involves multiple manual steps and interactions, which can be time-consuming and cumbersome for both customers and institutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MantineProvider>
            <Providers>{children}</Providers>
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

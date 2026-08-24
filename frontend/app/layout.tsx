import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BGW720 Reflash Analytics",
  description: "Live operational dashboard for BGW720 reflash test performance, yield and failure analysis.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

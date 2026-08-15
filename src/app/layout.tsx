import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Dilsha Atugedara",
  description:
    "Computer Science and Engineering undergraduate at the University of Moratuwa. Full-stack developer and UI/UX designer.",
  openGraph: {
    title: "Dilsha Atugedara",
    description: "Full-stack developer & UI/UX designer from Sri Lanka.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}

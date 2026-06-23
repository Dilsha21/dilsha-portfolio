import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Admin — Dilsha Portfolio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" />
    </>
  );
}

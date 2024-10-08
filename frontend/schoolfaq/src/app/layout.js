import { Inter } from "next/font/google";
import "./globals.css";

//Fonts from google
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "School FAQ",
  description: "School FAQ for MSD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

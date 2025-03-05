import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "API Key Management Dashboard",
  description: "Manage your API keys with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
            style: {
              maxWidth: "500px",
            },
          }}
        />
      </body>
    </html>
  );
}

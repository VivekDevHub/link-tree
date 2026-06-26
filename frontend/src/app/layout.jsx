import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Linkter",
  description: "Make a link tree for your instagram profile in seconds. Free and open source.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            theme="colored"
          />
        </AuthProvider>
      </body>
    </html>
  );
}

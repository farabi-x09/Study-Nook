import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navber from "@/components/Navber";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "StudyNook — Find Your Perfect Study Space",
  description: "Discover and book cozy, focused study rooms near you with StudyNook.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} antialiased w-full`}
    >
      <body className="min-h-screen flex flex-col overflow-x-hidden w-full">
         <Navber />
         <main className="flex-1 flex flex-col w-full">
          {children}
         </main>
         <Footer />
            <Toaster />
      </body>
    </html>
  );
}

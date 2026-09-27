import type { Metadata } from "next";
import { display, body } from "@/lib/fonts";
import CustomCursor from "@/components/effects/CustomCursor";
import LoadingScreen from "@/components/effects/LoadingScreen";
import { AppContextProvider } from "@/lib/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookBazar — We Turn Old Books Into New Stories",
  description:
    "Buy and sell used academic books inside a trusted university community.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <AppContextProvider>
          <LoadingScreen />
          <CustomCursor />
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}

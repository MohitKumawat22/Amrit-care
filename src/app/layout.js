import "./globals.css";
import MedicineAlarmService from "@/components/reminders/MedicineAlarmService";
import AuthProvider from "@/components/AuthProvider";
import PWAProvider from "@/components/shared/PWAProvider";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#187C73",
};

export const metadata = {
  title: "AmritCare — Care, made clearer",
  description: "Manage symptoms, appointments, medicines, and nearby care in one place.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AmritCare",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased text-gray-800">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AmritCare" />
      </head>
      <body className="min-h-full flex flex-col text-[15px] leading-relaxed overscroll-y-contain">
        <AuthProvider>
          <PWAProvider>
            <MedicineAlarmService />
            {children}
          </PWAProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

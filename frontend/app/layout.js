import "./globals.css";

export const metadata = {
  title: "DevConnect",
  description: "A developer networking platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

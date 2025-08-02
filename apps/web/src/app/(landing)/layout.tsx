import { AuthProvider } from "~/contexts";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthProvider useAuth={false}>{children}</AuthProvider>;
}

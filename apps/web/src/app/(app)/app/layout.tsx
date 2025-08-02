import { AuthProvider } from "~/contexts";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthProvider useAuth={true}>{children}</AuthProvider>;
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page should NOT show the admin sidebar
  // Just render the content directly without the admin layout wrapper
  return <>{children}</>;
}

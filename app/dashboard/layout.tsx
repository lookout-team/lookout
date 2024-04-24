export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mt-8 ps-36 pe-36">{children}</div>;
}

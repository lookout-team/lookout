export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 sm:ps-24 sm:pe-24 md:ps-36 md:pe-36 lg:ps-52 lg:pe-52 xl:ps-64 xl:pe-64 2xl:ps-80 2xl:pe-80">
      {children}
    </div>
  );
}

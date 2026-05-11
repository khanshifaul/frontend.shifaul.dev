export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="print">
      <body className="bg-white text-gray-800">
        <main className="">{children}</main>
      </body>
    </html>
  );
}

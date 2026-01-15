import AppHeader from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme-provider";
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <AppHeader />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}

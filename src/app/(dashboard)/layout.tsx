import { cookies } from "next/headers";
import AppHeader from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

// Added 'export default' here!
export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* This wrapper ensures the footer/header behave correctly */}
          <div className="relative flex min-h-screen flex-col">
            <SidebarProvider defaultOpen={defaultOpen}>
              {/* Sidebar sits on the left */}
              <AppSidebar />

              {/* This wrapper holds the header and the main content */}
              <div className="flex flex-col flex-1 w-full">
                <AppHeader />
                <main className="flex-1 p-6">
                  {/* Added margin-bottom */}
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

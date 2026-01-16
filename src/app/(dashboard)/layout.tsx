import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AppHeader from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ShopProvider } from "@/context/shop-context";
import { redirect } from "next/navigation";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <SidebarProvider defaultOpen={defaultOpen}>
              <ShopProvider userId={user.id}>
                <AppSidebar />
                <div className="flex flex-col flex-1 w-full">
                  <AppHeader />
                  <main className="flex-1 p-6">{children}</main>
                </div>
              </ShopProvider>
            </SidebarProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

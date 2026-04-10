import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/layout/sidebar-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50 dark:bg-slate-950 flex-row overflow-hidden transition-colors duration-200">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
          <Header />

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col">
            <div className="mx-auto max-w-7xl flex-1 w-full">
              {children}
            </div>

            {/* Dashboard Footer */}
            <footer className="mt-auto pt-10 pb-4">
              <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500 font-medium">
                  <p>Built with ❤️ by <span className="font-bold text-gray-700">Shubham Dongare & Soham kale</span></p>
                  <div className="flex gap-4 mt-1">
                    <a href="tel:8265000411" className="hover:text-blue-600 transition-colors">📞 8265000411</a>
                    <a href="mailto:shubhamdongare912@gmail.com" className="hover:text-blue-600 transition-colors">✉️ shubhamdongare912@gmail.com</a>
                  </div>
                </div>

                <div className="max-w-md text-right">
                  <p className="text-sm italic text-gray-600 dark:text-slate-400 transition-colors duration-200">
                    &quot;Wherever the art of Medicine is loved, there is also a love of Humanity.&quot;
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 transition-colors duration-200">— Hippocrates</p>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

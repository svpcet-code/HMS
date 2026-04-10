export default async function DashboardTemplate({ children }: { children: React.ReactNode }) {
  // Artificial delay to allow the beautiful loading screen to be viewed for 1.5 seconds.
  // In a real production scenario with instantly loaded cached data, this is often removed.
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  return <>{children}</>;
}

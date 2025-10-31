// Subscription guard temporarily disabled - re-enable once database is properly configured
// import { SubscriptionGuard } from "@/components/auth/subscription-guard";

export default function NewNoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Re-enable subscription guard once database connection is working
  // return (
  //   <SubscriptionGuard>
  //     {children}
  //   </SubscriptionGuard>
  // );
  
  return <>{children}</>;
}


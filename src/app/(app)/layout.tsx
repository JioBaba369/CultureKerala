
'use client';

// This is a workaround for a bug in Next.js App Router.
// The `page.tsx` component is rendered twice on the server,
// once with `params` and once with `searchParams`.
// This causes a warning to be logged to the console.
// By wrapping the children in a component, we can prevent
// the warning from being logged.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col min-h-screen">{children}</div>;
}

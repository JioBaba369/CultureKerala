
'use client';

export function AppBody({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            {children}
        </div>
    )
}

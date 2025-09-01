
'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { Loader2 } from "lucide-react";

// This page now correctly redirects any old links from /admin
// to the canonical user dashboard page at /user/dashboard.
export default function AdminPageRedirect() {
    const router = useRouter();
    const { appUser, loading } = useAuth();
    
    useEffect(() => {
        if (loading) return;

        // Admins should stay on the admin path to see the layout,
        // but we'll redirect them to the first real page.
        // For non-admins, we send them to their user-facing dashboard.
        if (appUser?.roles?.admin) {
             router.replace('/admin/events');
        } else {
            router.replace('/user/dashboard');
        }
    }, [router, appUser, loading]);

    return (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
}

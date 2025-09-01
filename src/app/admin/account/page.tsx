
'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This page now correctly redirects any old links from /admin/account
// to the canonical user settings page at /user/account.
export default function AccountPageRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/user/account');
    }, [router]);

    return null;
}

'use client';

import { ProfileForm } from "@/components/profile-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPageRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/user/account');
    }, [router]);

    return null;
}


'use client';

import { UserProfileForm } from "@/components/onboarding/user-profile-form";
import { useRouter } from "next/navigation";

export default function OnboardingProfilePage() {
    const router = useRouter();

    const onSave = () => {
        router.push('/onboarding/interests');
    }

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold">Set Up Your Profile</h1>
            <p className="text-muted-foreground mt-2">
                This information will be displayed on your public profile page.
            </p>
            <div className="mt-8">
                <UserProfileForm onSave={onSave} />
            </div>
        </div>
    );
}

    
'use client';

import { ProfileForm } from '@/components/profile-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/firebase/auth';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MyAccountPage() {
    const { appUser } = useAuth();
    return (
        <div className="container mx-auto px-4 py-8">
            <ProfileForm />
        </div>
    );
}

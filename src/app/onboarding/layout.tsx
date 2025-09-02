
'use client';

import withAuth from '@/components/auth/withAuth';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';

function OnboardingWizardLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingLayout>
        {children}
    </OnboardingLayout>
  );
}

export default withAuth(OnboardingWizardLayout);

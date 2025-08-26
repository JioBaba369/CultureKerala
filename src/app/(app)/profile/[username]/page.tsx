
import { notFound } from 'next/navigation';
import { getUserByUsername } from '@/actions/user-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

type Props = {
    params: {
        username: string;
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUserByUsername(params.username);

  if (!user) {
    return {};
  }

  const ogImage = user.photoURL || siteConfig.ogImage;
  const description = user.bio || `View the profile of ${user.displayName} on ${siteConfig.name}.`;

  return {
    title: user.displayName,
    description,
    openGraph: {
      title: user.displayName,
      description,
      type: 'profile',
      url: `${siteConfig.url}/profile/${user.username}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: user.displayName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: user.displayName,
      description,
      images: [ogImage],
    },
  };
}

export default async function UserProfilePage({ params }: Props) {
    const user = await getUserByUsername(params.username);

    if (!user) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
            <Card>
                <CardHeader className="flex flex-col items-center text-center p-8 space-y-4">
                    <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName} data-ai-hint="user profile picture" />
                        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <CardTitle className="font-headline text-4xl">{user.displayName}</CardTitle>
                        <p className="text-muted-foreground">@{user.username}</p>
                    </div>
                     {user.bio && <p className="text-lg text-muted-foreground max-w-prose">{user.bio}</p>}
                </CardHeader>
                <CardContent className="p-8">
                     {/* Placeholder for user-associated content like communities or events */}
                     <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                        <h3 className="font-headline text-2xl">Content Coming Soon</h3>
                        <p>This user's communities and events will be displayed here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Revalidate data at most every 5 minutes
export const revalidate = 300;

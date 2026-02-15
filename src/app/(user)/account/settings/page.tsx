import { redirect } from 'next/navigation';
import { getUserWithProfile } from '@/lib/supabase/server';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ProfileForm,
  PasswordForm,
  DeleteAccount,
} from '@/components/features/account';

export default async function SettingsPage() {
  const result = await getUserWithProfile();

  if (!result) {
    redirect('/login');
  }

  const { user, profile } = result;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and account preferences"
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm
                defaultValues={{
                  fullName: profile?.full_name || '',
                  email: user.email || '',
                  phone: profile?.phone,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <PasswordForm />
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardContent className="pt-6">
              <DeleteAccount />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

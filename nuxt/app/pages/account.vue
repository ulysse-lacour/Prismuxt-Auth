<script setup lang="ts">
  definePageMeta({
    layout: "auth",
  });

  // Name form
  const firstName = ref("");
  const lastName = ref("");

  const handleNameUpdate = () => {
    if (!firstName.value || !lastName.value) return;
    console.log("Name updated:", {
      firstName: firstName.value,
      lastName: lastName.value,
    });
  };

  // Email form
  const email = ref("");

  const handleEmailUpdate = () => {
    if (!email.value) return;
    console.log("Email updated:", {
      email: email.value,
    });
  };

  // Password form
  const currentPassword = ref("");
  const newPassword = ref("");

  const handlePasswordUpdate = () => {
    if (!currentPassword.value || !newPassword.value) return;
    if (newPassword.value.length < 8) {
      // You might want to show an error message here
      return;
    }
    console.log("Password updated:", {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
  };
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-1 flex-col gap-6 p-6">
    <div class="space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Account</h2>
      <p class="text-muted-foreground">Manage your account settings and set your preferences.</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Name Form -->
        <form @submit.prevent="handleNameUpdate" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label>First name</Label>
              <Input v-model="firstName" placeholder="Enter your first name" required />
            </div>

            <div class="grid gap-2">
              <Label>Last name</Label>
              <Input v-model="lastName" placeholder="Enter your last name" required />
            </div>
          </div>
          <div class="flex justify-end">
            <Button type="submit">Update name</Button>
          </div>
        </form>

        <Separator />

        <!-- Email Form -->
        <form @submit.prevent="handleEmailUpdate" class="space-y-4">
          <div class="grid gap-2">
            <Label>Email</Label>
            <Input v-model="email" type="email" placeholder="Enter your email" required />
          </div>
          <div class="flex justify-end">
            <Button type="submit">Update email</Button>
          </div>
        </form>

        <Separator />

        <!-- Password Form -->
        <form @submit.prevent="handlePasswordUpdate" class="space-y-4">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label>Current Password</Label>
              <Input
                v-model="currentPassword"
                type="password"
                placeholder="Enter current password"
                required
              />
            </div>

            <div class="grid gap-2">
              <Label>New Password</Label>
              <Input
                v-model="newPassword"
                type="password"
                placeholder="Enter new password"
                required
              />
            </div>
          </div>
          <div class="flex justify-end">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

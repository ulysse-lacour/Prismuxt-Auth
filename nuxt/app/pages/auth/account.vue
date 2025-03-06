<script setup lang="ts">
  definePageMeta({
    layout: "auth",
  });
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
        <NameUpdate />

        <Separator />

        <EmailUpdate />

        <Separator />

        <PasswordUpdate />
      </CardContent>
    </Card>
  </div>
</template>

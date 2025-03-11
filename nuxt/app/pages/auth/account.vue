<script setup lang="ts">
  /**
   * Account Page
   *
   * Displays user account settings and management options
   * Provides components for updating personal information
   */

  // Define page metadata
  definePageMeta({
    layout: "auth",
  });
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-1 flex-col gap-6 p-6">
    <!-- Page header -->
    <div class="space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Account</h2>
      <p class="text-muted-foreground">Manage your account settings and set your preferences.</p>
    </div>

    <!-- Account settings card -->
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Name update component -->
        <NameUpdate />

        <Separator />

        <!-- Email update component -->
        <EmailUpdate />

        <Separator />

        <!-- Password update component -->
        <PasswordUpdate />
      </CardContent>
    </Card>
  </div>
</template>

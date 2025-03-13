<script setup lang="ts">
  /**
   * User Navigation Component
   *
   * Displays user information and account options in the sidebar footer
   * Provides dropdown menu for account settings and logout
   */
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-vue-next";

  import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "../../components/ui/sidebar";

  // Get sidebar state for responsive dropdown positioning
  const { isMobile } = useSidebar();

  // Router for navigation
  const router = useRouter();

  // Authentication session
  const session = useSession();

  // User data from store
  const userDataStore = useUserDataStore();
  const user = computed(() => userDataStore.user);

  /**
   * Handle user logout
   * Signs out the user and redirects to home page
   */
  const handleLogout = async () => {
    await signOut();
    userDataStore.setUser({} as any);
    router.push("/");
  };
</script>

<template>
  <SidebarMenu v-if="session && user.name && user.email">
    <SidebarMenuItem>
      <!-- User dropdown menu -->
      <DropdownMenu>
        <!-- User profile trigger button -->
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <!-- User avatar -->
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarFallback class="rounded-lg" v-if="user.name">{{
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              }}</AvatarFallback>
            </Avatar>

            <!-- User information -->
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <!-- Dropdown menu content -->
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <!-- Account settings group -->
          <DropdownMenuGroup>
            <NuxtLink to="/auth/account">
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </NuxtLink>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <!-- Logout option -->
          <DropdownMenuItem @click="handleLogout">
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

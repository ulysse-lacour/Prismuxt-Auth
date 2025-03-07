<script setup lang="ts">
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "@/components/ui/sidebar";
  import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-vue-next";

  const { isMobile } = useSidebar();

  const router = useRouter();

  const session = useSession();

  const userDataStore = useUserDataStore();
  const user = computed(() => userDataStore.user);
</script>

<template>
  <SidebarMenu v-if="session && user.name && user.email">
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarFallback class="rounded-lg" v-if="user.name">{{
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              }}</AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuGroup>
            <NuxtLink to="/auth/account">
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </NuxtLink>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            @click="
              async () => {
                await signOut();
                userDataStore.setUser({});
                router.push('/');
              }
            "
          >
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

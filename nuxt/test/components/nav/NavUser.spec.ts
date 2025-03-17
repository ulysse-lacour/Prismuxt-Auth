import NavUser from "@/components/nav/NavUser.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";

// Define stub components
const stubs = {
  SidebarMenu: {
    name: "SidebarMenu",
    template: '<div class="sidebar-menu"><slot /></div>',
  },
  SidebarMenuItem: {
    name: "SidebarMenuItem",
    template: '<div class="sidebar-menu-item"><slot /></div>',
  },
  SidebarMenuButton: {
    name: "SidebarMenuButton",
    props: ["size", "class"],
    template: '<button class="sidebar-menu-button"><slot /></button>',
  },
  DropdownMenu: {
    name: "DropdownMenu",
    template: '<div class="dropdown-menu"><slot /></div>',
  },
  DropdownMenuContent: {
    name: "DropdownMenuContent",
    props: ["class", "side", "align", "sideOffset"],
    template: '<div class="dropdown-menu-content"><slot /></div>',
  },
  DropdownMenuGroup: {
    name: "DropdownMenuGroup",
    template: '<div class="dropdown-menu-group"><slot /></div>',
  },
  DropdownMenuItem: {
    name: "DropdownMenuItem",
    template: '<div class="dropdown-menu-item" @click="$emit(\'click\')"><slot /></div>',
  },
  DropdownMenuSeparator: {
    name: "DropdownMenuSeparator",
    template: '<div class="dropdown-menu-separator"></div>',
  },
  DropdownMenuTrigger: {
    name: "DropdownMenuTrigger",
    props: ["asChild"],
    template: '<div class="dropdown-menu-trigger"><slot /></div>',
  },
  Avatar: {
    name: "Avatar",
    props: ["class"],
    template: '<div class="avatar"><slot /></div>',
  },
  AvatarFallback: {
    name: "AvatarFallback",
    props: ["class"],
    template: '<div class="avatar-fallback"><slot /></div>',
  },
  NuxtLink: {
    name: "NuxtLink",
    props: ["to"],
    template: '<a :href="to"><slot /></a>',
  },
  BadgeCheck: {
    name: "BadgeCheck",
    render: () => {},
  },
  Bell: {
    name: "Bell",
    render: () => {},
  },
  ChevronsUpDown: {
    name: "ChevronsUpDown",
    render: () => {},
  },
  CreditCard: {
    name: "CreditCard",
    render: () => {},
  },
  LogOut: {
    name: "LogOut",
    render: () => {},
  },
  Sparkles: {
    name: "Sparkles",
    render: () => {},
  },
};

describe("NavUser Component", () => {
  it("can be imported", () => {
    expect(NavUser).toBeDefined();
  });
});

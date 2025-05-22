"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartArea,
  IconHelp,
  IconRoute,
  IconNumber,
  IconSettings,
  IconMap,
  IconHome,
  IconWind,
  IconMapPin,
  IconBattery3,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { HomeIcon } from "lucide-react";
import { url } from "inspector";

const data = {
  user: {
    name: "asil",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconHome,
    },
    {
      title: "Charts",
      url: "#",
      icon: IconChartArea,
    },
    {
      title: "Visualize",
      url: "#",
      icon: IconMap,
    },
    // {
    //   title: "Projects",
    //   url: "#",
    //   icon: IconFolder,
    // },
    // {
    //   title: "Team",
    //   url: "#",
    //   icon: IconUsers,
    // },
  ],
  // navClouds: [
  //   {
  //     title: "Capture",
  //     icon: IconCamera,
  //     isActive: true,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Proposal",
  //     icon: IconFileDescription,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Prompts",
  //     icon: IconFileAi,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "About",
      url: "#",
      icon: IconHelp,
    },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: IconHelp,
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch,
    // },
  ],
  // documents: [
  //   {
  //     name: "Data Library",
  //     url: "#",
  //     icon: IconDatabase,
  //   },
  //   {
  //     name: "Reports",
  //     url: "#",
  //     icon: IconReport,
  //   },
  //   {
  //     name: "Word Assistant",
  //     url: "#",
  //     icon: IconFileWord,
  //   },
  // ],
  sensors: [
    {
      name: "Locations",
      url: "#",
      icon: IconMapPin,
    },
    {
      name: "Sensors",
      url: "#",
      icon: IconWind,
    },
    {
      name: "Battery Info",
      url: "#",
      icon: IconBattery3,
    },
  ],
  traffic: [
    {
      name: "Vehicle Count",
      url: "#",
      icon: IconNumber,
    },
    {
      name: "Routes",
      url: "#",
      icon: IconRoute,
    },
    // {
    //   name: "Battery Info",
    //   url: "#",
    //   icon: IconBattery3,
    // },
    {
      name: "Camera Settings",
      url: "#",
      icon: IconCamera,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex items-center data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Image
                className="h-auto w-full object-contain"
                src="/upcare-logo.webp"
                alt="UP CARE Logo"
                priority
                width="500"
                height="150"
              />

              {/* <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.sensors} label="Air Quality" />
        <NavDocuments items={data.traffic} label="Traffic" />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

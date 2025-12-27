"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  HomeIcon,
  KeyRound,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  BrainCog,
} from "lucide-react"

import { NavMain } from "@/components/shared/nav-main"
import { NavProjects } from "@/components/shared/nav-projects"
import { NavUser } from "@/components/shared/nav-user"
import { TeamSwitcher } from "@/components/shared/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/next.svg",
  },
  teams: [
    {
      name: "ITWorx",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "ITWorx Inc",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "ITWorx Gulf",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: HomeIcon,
      isActive: true,
    },
    /*
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      //isActive: true,
      items: [
        {
          title: "d",
          url: "/dashboard",
        },
        {
          title: "Starred",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
      ],
    },
    {
      title: "Playground",
      url: "/dashboard/playground",
      icon: SquareTerminal,
    },
    */
    {
      title: "Orchestrators",
      url: "/dashboard/settings/orchestrator",
      icon: BrainCog,
    },
    {
      title: "Agents",
      url: "/dashboard/settings/agents",
      icon: Bot,
    },
    {
      title: "MCP Servers",
      url: "/dashboard/settings/mcp-servers",
      icon: Settings2,
    },
    {
      title: "API Keys",
      url: "/dashboard/settings/api-keys-2",
      icon: KeyRound,
    },
    /*
    {
      title: "Models",
      url: "/dashboard/settings/llm",
      icon: Bot,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "MCP Servers2",
          url: "#",
        },
        {
          title: "Tools",
          url: "/dashboard/settings/tools",
        },
        {
          title: "API Keys",
          url: "/dashboard/settings/api-keys",
        },
        {
          title: "LLMs",
          url: "/dashboard/settings/llm",
        },
      ],
    },
    */
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

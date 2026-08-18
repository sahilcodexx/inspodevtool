"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

export interface MenuItem {
  icon: string;
  label: string;
  action?: string;
  iconClass?: string;
  rightIcon?: string;
}

export interface UserDropdownUser {
  name?: string;
  username?: string;
  avatar?: string;
  initials?: string;
  status?: string;
}

export interface UserDropdownProps {
  user?: UserDropdownUser;
  onAction?: (action?: string) => void;
  onStatusChange?: (status: string) => void;
  selectedStatus?: string;
  promoDiscount?: string;
  accounts?: any[];
  trigger?: React.ReactNode;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: "solar:settings-line-duotone", label: "Settings", action: "settings" },
  {
    icon: "solar:letter-unread-line-duotone",
    label: "What's new?",
    action: "whats-new",
    rightIcon: "solar:square-top-down-line-duotone",
  },
  {
    icon: "solar:question-circle-line-duotone",
    label: "Get help?",
    action: "help",
    rightIcon: "solar:square-top-down-line-duotone",
  },
];

const LOGOUT_ITEM: MenuItem = {
  icon: "solar:logout-2-bold-duotone",
  label: "Log out",
  action: "logout",
};

export const UserDropdown: React.FC<UserDropdownProps> = ({
  user = {
    name: "Sahil Singh",
    username: "@sahilcodex",
    avatar: "https://sahilcodex.vercel.app/_next/image?url=%2Favatar.avif&w=256&q=75",
    initials: "SS",
    status: "online",
  },
  onAction = () => {},
  trigger,
}) => {
  const renderMenuItem = (item: MenuItem, index: number) => (
    <DropdownMenuItem
      key={index}
      className={cn(
        item.rightIcon ? "justify-between" : "",
        "p-2 rounded-lg cursor-pointer"
      )}
      onClick={() => onAction(item.action)}
    >
      <span className="flex items-center gap-1.5 font-medium text-sm">
        <Icon
          icon={item.icon}
          className={`size-5 ${item.iconClass || "text-gray-500 dark:text-gray-400"}`}
        />
        {item.label}
      </span>
      {item.rightIcon && (
        <Icon
          icon={item.rightIcon}
          className="size-4 text-gray-500 dark:text-gray-400"
        />
      )}
    </DropdownMenuItem>
  );

  const getStatusColor = (status: string = "online") => {
    const colors: Record<string, string> = {
      online:
        "text-green-600 bg-green-100 border-green-300 dark:text-green-400 dark:bg-green-900/30 dark:border-green-500/50",
      offline:
        "text-gray-600 bg-gray-100 border-gray-300 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600",
      busy:
        "text-red-600 bg-red-100 border-red-300 dark:text-red-400 dark:bg-red-900/30 dark:border-red-500/50",
    };
    return colors[status.toLowerCase()] || colors.online;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Avatar className="cursor-pointer size-10 border border-white dark:border-gray-700">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="no-scrollbar w-[280px] rounded-2xl bg-white dark:bg-black/90 p-0 shadow-xl"
        align="end"
      >
        <section className="bg-white dark:bg-zinc-900/90 backdrop-blur-lg rounded-2xl p-1 shadow border border-gray-200 dark:border-gray-700/40">
          <div className="flex items-center p-2">
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <Avatar className="cursor-pointer size-10 border border-white dark:border-gray-700 shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </h3>
                <p className="text-muted-foreground text-xs truncate">
                  {user.username}
                </p>
              </div>
            </div>
            {user.status && (
              <Badge
                className={`${getStatusColor(
                  user.status
                )} border-[0.5px] text-[11px] rounded-sm capitalize shrink-0 ml-2`}
              >
                {user.status}
              </Badge>
            )}
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {MENU_ITEMS.map(renderMenuItem)}
          </DropdownMenuGroup>
        </section>

        <section className="mt-1 p-1 rounded-2xl">
          <DropdownMenuGroup>
            {renderMenuItem(LOGOUT_ITEM, 99)}
          </DropdownMenuGroup>
        </section>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;

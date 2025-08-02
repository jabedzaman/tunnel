import { IUser } from "@tunnel/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { queryClient } from "~/lib/query-client";
import { clearStore } from "~/store";

export const UserMenu = ({ user }: { user: IUser | null }) => {
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["logout"],
    mutationFn: api.auth.logout,
    onSuccess: async () => {
      // invalidate the auth key to refetch user data
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      // clear the store
      clearStore();
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none focus:ring-0 focus:outline-none rounded-full">
          <Avatar className="w-10 h-10">
            <AvatarFallback>
              {user?.firstName?.charAt(0) || user?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => !isPending && (await mutateAsync())}
        >
          {isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

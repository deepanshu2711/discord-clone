"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
  data: {
    lable: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setopen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setopen(false);
    if (type === "channel") {
      router.push(`/servers/${params?.serverId}/channels/${id}`);
    }
    if (type === "member") {
      router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }
  };
  return (
    <>
      <button
        onClick={() => setopen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50
      transition
      "
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p
          className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600
        dark:group-hover:text-zinc-300 transition
        "
        >
          Search
        </p>
        <kbd className="pointer-events-none inline-flex mx-auto items-center justify-center rounded px-1.5 py-1 text-xs font-sans font-medium uppercase text-zinc-500">
          <span className="text-xs">CTRL+</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setopen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ lable, type, data }) => {
            if (!data?.length) return null;
            return (
              <CommandGroup key={lable} heading={lable}>
                {data.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      onSelect={() => onClick({ id, type })}
                      key={id}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;

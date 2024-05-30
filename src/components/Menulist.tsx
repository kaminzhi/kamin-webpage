import { Menu } from "@headlessui/react";
import React from "react";
import { BsMenuButtonWideFill } from "react-icons/bs";

export default function Menulist() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center rounded-md border border-zinc-400 dark:border-zinc-500 px-2 py-2 text-sm font-medium shadow-sm hover:bg-pink-300 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-gray-600">
          <BsMenuButtonWideFill className="h-5 w-5" />
        </Menu.Button>
      </div>
    </Menu>
  );
}

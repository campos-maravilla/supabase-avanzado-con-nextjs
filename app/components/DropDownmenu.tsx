import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/client";
import { FaSignOutAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";


export default function DropDowMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton
        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/8 px-3 py-2 text-md  text-gr
        inset-ring-white/5 "
      >
        Perfil
        <ChevronDownIcon
          aria-hidden="true"
          className="-mr-1 size-5 text-gray-400"
        />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-white/40 rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1 flex flex-col items-center">
          <MenuItem>
            <a
              href="/profile"
              className="px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden flex jusitems-center gap-1 mr-3"
            >
              <FaEdit className="w-6 h-6 text-gray-300" />
              <span className="text-gray-300 "> Editar perfil</span>
            </a>
          </MenuItem>
          <MenuItem>
            <button
              onClick={handleLogout}
              className=" px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden flex jusitems-center gap-1"
            >
              <FaSignOutAlt className="w-6 h-6 text-gray-300" />
              <span className="text-gray-300"> Cerrar sesión</span>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}

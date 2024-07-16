import React from "react";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";
import useStore from "../../zustand";

interface MenuItemProps {
  onClick?: () => void;
  catalog: string;
  listItems: Array<{
    isLink: boolean;
    url?: string;
    icon: IconType;
    label: string;
    onClick?: () => void;
    roles: string[];
  }>;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, catalog, listItems }) => {
  const user = useStore((state) => state.user);

  return (
    <div className="w-full flex flex-col items-stretch gap-2">
      <span className="hidden xl:block px-2 xl:text-sm 2xl:text-base 3xl:text-lg uppercase">
        {catalog}
      </span>
      {listItems.map((listItem, index) => {
        const isRoled = listItem.roles.includes(
          user.data?.level.toString() || ""
        );
        if (listItem.isLink && isRoled) {
          return (
            <NavLink
              key={index}
              onClick={onClick}
              to={listItem.url || ""}
              className={({ isActive }) =>
                isActive
                  ? "btn 2xl:min-h-[52px] 3xl:min-h-[64px] btn-active btn-ghost btn-block justify-start"
                  : "btn 2xl:min-h-[52px] 3xl:min-h-[64px] btn-ghost btn-block justify-start"
              }
            >
              <listItem.icon className="xl:text-2xl 2xl:text-3xl 3xl:text-4xl" />
              <span className="xl:text-sm 2xl:text-base 3xl:text-lg capitalize">
                {listItem.label}
              </span>
            </NavLink>
          );
        } else if (isRoled) {
          return (
            <button
              key={index}
              onClick={listItem.onClick}
              className="btn 2xl:min-h-[52px] 3xl:min-h-[64px] btn-ghost btn-block justify-start"
            >
              <listItem.icon className="xl:text-2xl 2xl:text-3xl 3xl:text-4xl" />
              <span className="xl:text-sm 2xl:text-base 3xl:text-lg capitalize">
                {listItem.label}
              </span>
            </button>
          );
        } else {
          null;
        }
      })}
    </div>
  );
};

export default MenuItem;

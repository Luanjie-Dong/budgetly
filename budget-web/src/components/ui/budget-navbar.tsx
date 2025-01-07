"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import ToggleApp from "../toggle-mode";


export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const years = Array.from({ length: 5 }, (_, i) => 2023 + i);

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={null} item="Overview" url="/">
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Budgets" url="/budget">
        {years.map((year,index) =>(
          <ProductItem
          title={year}
          href={`/budget?year=${year}`}
          description=""
          key = {index}
        />
        ))}
          
        </MenuItem>
        <MenuItem setActive={setActive} active={null} item="Trips" url="/trips">
        </MenuItem>
        <ToggleApp></ToggleApp>
      </Menu>
      
    </div>
  );
}

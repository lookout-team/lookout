"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function AppNavbar() {
  const pathname = usePathname();

  const navbarItems = [];
  const pages = ["Home", "Projects", "Assistant"];

  for (const page of pages) {
    const isActive = pathname.includes(page.toLowerCase());
    const link = `/dashboard/${page.toLowerCase()}`
    const color = isActive ? undefined : "foreground";
    const underline = isActive ? "active" : undefined;

    navbarItems.push(
      <NavbarItem>
        <Link color={color} underline={underline} href={link}>
          {page}
        </Link>
      </NavbarItem>
    );
  }

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit">Lookout</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navbarItems}
      </NavbarContent>
      {/* TODO: Authentication */}
      <NavbarContent justify="end">
        {/* <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem> */}
      </NavbarContent>
    </Navbar>
  );
}

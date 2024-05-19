"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { User } from "@prisma/client";
import { CircleUser, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  user: User | null;
}

export default function AppNavbar(props: Props) {
  const pathname = usePathname();

  const navbarItems = [];
  const pages = ["Home", "Projects", "Assistant"];

  for (const page of pages) {
    const isActive = pathname.includes(page.toLowerCase());
    const link = `/dashboard/${page.toLowerCase()}`;
    const color = isActive ? undefined : "foreground";
    const underline = isActive ? "active" : undefined;

    navbarItems.push(
      <NavbarItem key={link}>
        <Link color={color} underline={underline} href={link}>
          {page}
        </Link>
      </NavbarItem>
    );
  }

  return (
    <Navbar className="justify-center" maxWidth="xl" isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit">Lookout</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navbarItems}
      </NavbarContent>
      <NavbarContent justify="end">
        {props.user ? (
          <>
            <NavbarItem>Hi {props.user.first_name}!</NavbarItem>
            <NavbarItem className="pt-1">
              <Link color="foreground" href="/settings">
                <CircleUser size={18} />
              </Link>
            </NavbarItem>
            <NavbarItem className="pt-1">
              <Link color="foreground" href="/signout">
                <LogOut size={18} />
              </Link>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Link href="/signin">Sign In</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}

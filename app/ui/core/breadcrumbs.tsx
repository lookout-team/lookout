"use client";

import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

type BreadcrumbItem = {
  title: string;
  link: string | undefined;
};

interface ComponentProps {
  items: BreadcrumbItem[];
}

export default function PageBreadcrumbs(props: ComponentProps) {
  return (
    <Breadcrumbs size="md">
      {props.items.map((item) => (
        <BreadcrumbItem key={item.title} href={item.link}>
          {item.title}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}

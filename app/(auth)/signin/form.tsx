"use client";

import { Button, Card, CardBody, Input } from "@nextui-org/react";

interface Props {
  action: (form: FormData) => Promise<void>;
}

export default function SignInForm(props: Props) {
  return (
    <Card shadow="sm">
      <CardBody className="p-6">
        <form action={props.action}>
          <Input
            className="mb-6"
            type="text"
            variant="bordered"
            label="Username or email"
            name="login"
            isRequired={true}
          />
          <Input
            className="mb-6"
            type="password"
            variant="bordered"
            name="password"
            label="Password"
            isRequired={true}
          />
          <Button type="submit" className="w-full" size="lg" color="primary">
            Sign in
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

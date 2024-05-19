"use client";

import { Button, Card, CardBody, Input } from "@nextui-org/react";

interface Props {
  action: (form: FormData) => Promise<void>;
}

export default function SignUpForm(props: Props) {
  return (
    <Card shadow="sm">
      <CardBody className="p-6">
        <form action={props.action}>
          <Input
            className="mb-6"
            variant="bordered"
            name="first_name"
            label="First name"
            isRequired={true}
          />
          <Input
            className="mb-6"
            variant="bordered"
            name="last_name"
            label="Last name"
            isRequired={true}
          />
          <Input
            className="mb-6"
            type="text"
            variant="bordered"
            name="email"
            label="Email"
            isRequired={true}
          />
          <Input
            className="mb-6"
            type="text"
            variant="bordered"
            name="username"
            label="Username"
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
            Create account
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { Project } from "@prisma/client";
import { useState } from "react";

export default function ProjectButtonModal({ project }: { project?: Project }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");

  return (
    <>
      <Button color="primary" variant="flat" onPress={onOpen}>
        {project === undefined ? "Create New Project" : "Edit Project Details"}
      </Button>
      <Modal
        placement="top-center"
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Project
              </ModalHeader>
              <ModalBody>
                <Input
                  className="mb-4"
                  variant="bordered"
                  label="Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  variant="bordered"
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Create Project
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

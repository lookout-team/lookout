"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

interface Props {
  buttonText: string;
  modalTitle?: string;
  modalSize?:
    | "lg"
    | "xs"
    | "sm"
    | "md"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full"
    | undefined;
  modalPlacement?:
    | "center"
    | "top-center"
    | "auto"
    | "top"
    | "bottom"
    | "bottom-center"
    | undefined;
  modalBody: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  submitAction: (form: FormData) => Promise<void>;
}

export default function ButtonModal(props: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button color="primary" variant="flat" onPress={onOpen}>
        {props.buttonText}
      </Button>
      <Modal
        placement={props.modalPlacement ?? "top-center"}
        size={props.modalSize ?? "lg"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form action={props.submitAction}>
              <ModalHeader className="flex flex-col gap-1">
                {props.modalTitle ?? props.buttonText}
              </ModalHeader>
              <ModalBody>{props.modalBody}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {props.cancelText ?? "Confirm"}
                </Button>
                <Button type="submit" color="primary" onPress={onClose}>
                  {props.confirmText ?? "Confirm"}
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

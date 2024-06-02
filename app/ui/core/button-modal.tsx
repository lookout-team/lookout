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

type ButtonColor = 
| "primary"
| "default"
| "secondary"
| "success"
| "warning"
| "danger"
| undefined;

interface Props {
  buttonChildren: any;
  buttonSize?: "lg" | "sm" | "md" | undefined;
  buttonColor?: ButtonColor;
  buttonVariant?:
    | "flat"
    | "solid"
    | "bordered"
    | "light"
    | "faded"
    | "shadow"
    | "ghost"
    | undefined;
  modalTitle: string;
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
  modalScroll?: "inside" | "outside";
  confirmText?: string;
  confirmColor?: ButtonColor;
  cancelText?: string;
  submitAction: (form: FormData) => Promise<void>;
}

export default function ButtonModal(props: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color={props.buttonColor}
        size={props.buttonSize}
        variant={props.buttonVariant ?? "flat"}
        onPress={onOpen}
        >
        {props.buttonChildren}
      </Button>
      <Modal
        placement={props.modalPlacement ?? "top-center"}
        size={props.modalSize ?? "lg"}
        scrollBehavior={props.modalScroll}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form action={props.submitAction}>
              <ModalHeader className="flex flex-col gap-1">
                {props.modalTitle}
              </ModalHeader>
              <ModalBody>{props.modalBody}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {props.cancelText ?? "Cancel"}
                </Button>
                <Button type="submit" color={props.confirmColor} onPress={onClose}>
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

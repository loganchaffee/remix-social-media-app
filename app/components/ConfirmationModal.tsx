import { Button, ButtonProps } from "./Button";
import { Modal } from "./Modal";

type Props = {
  title: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonVariant?: ButtonProps["variant"];
};
export function ConfirmationModal({
  title,
  isOpen,
  onConfirm,
  onCancel,
  confirmButtonVariant,
}: Props) {
  return (
    <Modal
      title={title}
      centerTitle={true}
      isOpen={isOpen}
      onClose={onCancel}
      hasCloseButton={false}
    >
      <div className="flex justify-between">
        <Button variant={confirmButtonVariant} onClick={onConfirm}>
          Confirm
        </Button>
        <Button variant="blue-outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

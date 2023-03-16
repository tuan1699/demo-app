import { Modal, Text } from "@shopify/polaris";
import React from "react";

export function ModalComp(props) {
  const { confirmModal, setConfirmModal } = props;
  return (
    <div style={{ height: "500px" }}>
      <Modal
        open={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title={confirmModal.title}
        primaryAction={{
          content: confirmModal.contentAction,
          onAction: () => {
            setConfirmModal({
              ...confirmModal,
              loading: true,
            });
            confirmModal.onConfirm();
          },
          destructive: true,
          loading: confirmModal.loading,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              setConfirmModal({ ...confirmModal, isOpen: false });
            },
          },
        ]}
      >
        <Modal.Section>
          <Text>{confirmModal.subTitle}</Text>
        </Modal.Section>
      </Modal>
    </div>
  );
}

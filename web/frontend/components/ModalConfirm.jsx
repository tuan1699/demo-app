import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { Modal, Text } from "@shopify/polaris";
import React, { useState } from "react";

export function ModalConfirm({
  selectedPages,
  handleActiveModal,
  setIsLoading,
  refetch,
  setSelectedPages,
}) {
  const [loadingDelete, setLoadingDelete] = useState(false);

  const countPagesSelected = selectedPages.length;
  const fetch = useAuthenticatedFetch();

  const handleDeleteConfirm = async () => {
    setLoadingDelete(true);
    setIsLoading(true);
    const res = await fetch(`/api/pages?id=${selectedPages.toString()}`, {
      method: "DELETE",
    });

    if (res.ok) {
      refetch();
      console.log("OK");
      setLoadingDelete(false);
      setIsLoading(false);
      setSelectedPages([]);
      handleActiveModal();
    } else {
      console.log("NOT OK");
    }
  };

  return (
    <div style={{ height: "500px" }}>
      <Modal
        open
        onClose={handleActiveModal}
        title={`Delete ${countPagesSelected} ${
          countPagesSelected === 1 ? "page" : "pages"
        }`}
        primaryAction={{
          content: `Delete ${countPagesSelected} ${
            countPagesSelected === 1 ? "page" : "pages"
          }`,
          onAction: () => {
            console.log("Deleted");
            handleDeleteConfirm();
          },
          destructive: true,
          loading: loadingDelete ? true : false,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              console.log("cancel delete");
              handleActiveModal();
            },
          },
        ]}
      >
        <Modal.Section>
          <Text>
            Deleted pages cannot be recovered. Do you still want to continue?
          </Text>
        </Modal.Section>
      </Modal>
    </div>
  );
}

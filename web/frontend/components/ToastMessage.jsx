import { Button, Frame, Page, Toast } from "@shopify/polaris";
import React, { useCallback, useState } from "react";

export function ToastMessage({ toast, setToast }) {
  return (
    <div style={{ maxHeight: "1px", overflow: "hidden" }}>
      <Frame>
        <Toast
          content={toast.message}
          onDismiss={() => setToast({ ...toast, isOpen: false })}
          duration={1000}
        />
      </Frame>
    </div>
  );
}

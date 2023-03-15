import { Badge, Text } from "@shopify/polaris";
import React from "react";
import { validDate } from "../ulities/validDate";

export function PageItem({ title, body_html, created_at, published_at }) {
  return (
    <>
      <div style={{ display: "flex", gap: "6px" }}>
        <Text as="h3" variant="bodyMd" fontWeight="semibold">
          {title}
        </Text>
        {!published_at && <Badge>Hidden</Badge>}
      </div>
      {body_html && (
        <Text as="p" variant="bodyMd" color="subdued" fontWeight="regular">
          {body_html}
        </Text>
      )}
      <Text as="p" variant="bodyMd" color="subdued" fontWeight="regular">
        {validDate(created_at)}
      </Text>
    </>
  );
}

import { Badge, Text } from "@shopify/polaris";
import React, { useEffect, useRef, useState } from "react";
import { parserHTML } from "../ulities/parserHTML";
import { validDate } from "../ulities/validDate";

export function PageItem({ title, body_html, created_at, published_at }) {
  const [contentBody, setContentBody] = useState("");
  useEffect(() => {
    const content = parserHTML(body_html);

    setContentBody(content);
  }, []);

  return (
    <>
      <div style={{ display: "flex", gap: "6px" }}>
        <Text as="h3" variant="bodyMd" fontWeight="semibold">
          {title}
        </Text>
        {!published_at && <Badge>Hidden</Badge>}
      </div>
      {body_html && (
        <div
          style={{
            display: "-webkit-box",
            width: "80%",
            WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {contentBody}
        </div>
      )}
      <Text as="p" variant="bodyMd" color="subdued" fontWeight="regular">
        {validDate(created_at)}
      </Text>
    </>
  );
}

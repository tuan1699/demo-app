import { Banner } from "@shopify/polaris";
import React from "react";
import { LockMinor } from "@shopify/polaris-icons";

export function BannerWarning() {
  return (
    <Banner
      title="
      Store access is restricted"
      status="warning"
      action={{
        content: "See store password",
        url: "https://admin.shopify.com/store/first-store-byt/online_store/preferences?tutorial=unlock",
      }}
      icon={LockMinor}
    >
      <p>
        While your online store is in development, only visitors with the
        password can access it.
      </p>
    </Banner>
  );
}

import { useNavigate } from "@shopify/app-bridge-react";
import { LegacyCard, EmptyState } from "@shopify/polaris";
import React from "react";

export function EmptyStatePage() {
  const navigate = useNavigate();

  return (
    <LegacyCard sectioned>
      <EmptyState
        heading="Add pages to your online store"
        action={{ content: "Add Page", onAction: () => navigate("/new") }}
        image="https://cdn.shopify.com/shopifycloud/online-store-web/assets/8001a44e37248e13f435f27aac113bf41ef8c7b78c5a460e9c77137b887b37c0.svg"
        fullWidth
      >
        <p>
          Write clear page titles and descriptions to improve your search <br />{" "}
          engine optimization (SEO) and help customers find your website.
        </p>
      </EmptyState>
    </LegacyCard>
  );
}

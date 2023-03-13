import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";

import { BannerWarning, PagesControl } from "../components";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Page
      fullWidth={true}
      title="Pages"
      primaryAction={{
        content: "Add Page",
        onAction: () => navigate("/new"),
      }}
    >
      <BannerWarning />
      <div style={{ margin: "16px 0" }}>
        <PagesControl />
      </div>
    </Page>
  );
}

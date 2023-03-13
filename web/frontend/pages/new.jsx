import { ContextualSaveBar, useNavigate } from "@shopify/app-bridge-react";
import {
  Button,
  ButtonGroup,
  Form,
  Frame,
  Layout,
  LegacyCard,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useState } from "react";

import { TypeMinor } from "@shopify/polaris-icons";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignRight,
  FaAlignLeft,
} from "react-icons/fa";

export default function ManageCode() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [textValue, setTextValue] = useState("");
  const handleEmailChange = useCallback((value) => setEmail(value), []);

  const handleContentChange = useCallback((value) => setTextValue(value), []);

  return (
    <Page
      backAction={{
        onAction: () => navigate("/"),
      }}
      title="Add page"
    >
      <Form>
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <TextField
                value={email}
                onChange={handleEmailChange}
                label="Title"
                type="email"
                autoComplete="email"
                placeholder="e.g. Contact us, Sizing chart, FAQs"
              />
              <div style={{ marginTop: "16px" }}>
                <Text>Content</Text>
                <LegacyCard>
                  <LegacyCard.Section>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <ButtonGroup segmented>
                        <Button icon={TypeMinor} />
                        <Button icon={<FaBold />} />
                        <Button icon={<FaItalic />} />
                        <Button icon={<FaUnderline />} />
                      </ButtonGroup>
                      <ButtonGroup segmented>
                        <Button icon={<FaListUl />} />
                        <Button icon={<FaListOl />} />
                        <Button icon={<FaAlignRight />} />
                        <Button icon={<FaAlignLeft />} />
                      </ButtonGroup>

                      <ButtonGroup segmented>
                        <Button icon={<FaAlignRight />} />
                        <Button icon={<FaAlignLeft />} />
                      </ButtonGroup>
                    </div>
                  </LegacyCard.Section>
                  <LegacyCard.Section>
                    <TextField
                      value={textValue}
                      onChange={handleContentChange}
                    ></TextField>
                  </LegacyCard.Section>
                </LegacyCard>
              </div>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section secondary>
            <LegacyCard title="Tags" sectioned>
              <p>Add tags to your order.</p>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Form>
    </Page>
  );
}

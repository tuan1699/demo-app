import { useParams } from "react-router-dom";
import React, { useState, useCallback, useEffect } from "react";
import { useAppQuery } from "../hooks";

import { useNavigate } from "@shopify/app-bridge-react";
import {
  Badge,
  Button,
  ButtonGroup,
  ChoiceList,
  Form,
  Layout,
  LegacyCard,
  Page,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";

import { TypeMinor, ViewMajor, DuplicateMinor } from "@shopify/polaris-icons";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignRight,
  FaAlignLeft,
} from "react-icons/fa";
import { DueDatePicker, DueTimePicker } from "../components";
// import { DueDatePicker, DueTimePicker } from "../components";

export default function PageEdit() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {});

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState("today");
  const handleTitleChange = useCallback((value) => setTitle(value), []);
  const handleContentChange = useCallback((value) => setContent(value), []);
  const [selected, setSelected] = useState(["Visible"]);
  const [isSetDate, setIsSetDate] = useState(false);
  const [editWithSeo, setEditWithSeo] = useState(false);
  const [titleSeo, setTitleSeo] = useState("");
  const [descrSeo, setDecrSeo] = useState("");
  const [urlSeo, setUrlSeo] = useState("");

  const { data, error, refetch } = useAppQuery({
    url: `/api/pages?id=${id}`,
    reactQueryOptions: {
      onSuccess: (data) => {
        console.log(data);
        setTitle(data.title);
        setContent(data.body_html);
        setIsLoading(false);
      },
      onError: (error) => {
        console.log(error);
      },
    },
  });

  const handleChangeTitleSeo = useCallback((value) => {
    setTitleSeo(value);
  }, []);

  const handleChangeDecrSeo = useCallback((value) => {
    setDecrSeo(value);
  }, []);

  const handleChangeUrlSeo = useCallback((value) => {
    setUrlSeo(value);
  });

  const options = [
    { label: "Default", value: "today" },
    { label: "contact", value: "contact" },
  ];
  const handleThemeChange = useCallback((value) => setTheme(value), []);

  const handleChange = useCallback((value) => {
    console.log(value);
    setSelected(value);
    if (value.toString() === "Visible") {
      setIsSetDate(false);
    }
  }, []);

  return (
    <Page
      backAction={{
        onAction: () => navigate("/"),
      }}
      title={data && data.title}
      titleMetadata={data && data.published_at ? null : <Badge>Hidden</Badge>}
      secondaryActions={[
        { content: "Duplicate", icon: DuplicateMinor },
        { content: "Preview page", icon: ViewMajor },
      ]}
      pagination={{
        hasPrevious: true,
        hasNext: true,
      }}
    >
      <Form>
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <TextField
                value={title}
                onChange={handleTitleChange}
                label="Title"
                type="email"
                autoComplete="email"
                placeholder="e.g. Contact us, Sizing chart, FAQs"
              />
              <div style={{ marginTop: "16px" }}>
                <Text>Content</Text>
                <LegacyCard>
                  <LegacyCard>
                    <div
                      style={{ display: "flex", gap: "8px", padding: "8px" }}
                    >
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
                  </LegacyCard>
                  <LegacyCard.Subsection>
                    <TextField
                      value={content}
                      multiline={4}
                      onChange={handleContentChange}
                    ></TextField>
                  </LegacyCard.Subsection>
                </LegacyCard>
              </div>
            </LegacyCard>
            <LegacyCard
              title="Search engine listing preview"
              actions={[
                {
                  content: editWithSeo ? "" : "Edit website SEO",
                  onAction: () => {
                    setEditWithSeo(true);
                  },
                },
              ]}
            >
              <LegacyCard.Section>
                
                <p style={{ fontSize: "18px", color: "#1a0dab" }}>
                  Check add page
                </p>
                
              </LegacyCard.Section>
              {editWithSeo && (
                <LegacyCard.Section>
                  <div style={{ marginBottom: "10px" }}>
                    <TextField
                      label="Page title"
                      type="text"
                      value={titleSeo}
                      onChange={handleChangeTitleSeo}
                      helpText="0 of 70 characters used"
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <TextField
                      label="Description"
                      multiline={4}
                      value={descrSeo}
                      onChange={handleChangeDecrSeo}
                      helpText="0 of 320 characters used"
                    />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <TextField
                      label="URL and handle"
                      type="text"
                      prefix="https://first-store-byt.myshopify.com/pages/"
                      value={urlSeo}
                      onChange={handleChangeUrlSeo}
                    />
                  </div>
                </LegacyCard.Section>
              )}
            </LegacyCard>
          </Layout.Section>

          <Layout.Section secondary>
            <LegacyCard title="Visibility" sectioned>
              <ChoiceList
                choices={[
                  {
                    label:
                      selected?.toString() === `Visible`
                        ? `Visible (as of ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()})`
                        : `Visible`,
                    value: "Visible",
                  },
                  { label: "Hidden", value: "Hidden" },
                ]}
                selected={selected}
                onChange={handleChange}
              />
              {isSetDate ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    margin: "16px 0px",
                  }}
                >
                  <DueDatePicker />
                  <DueTimePicker />
                </div>
              ) : null}
              <div style={{ marginTop: "16px" }}>
                <Button
                  plain
                  onClick={() => {
                    setIsSetDate(!isSetDate);
                    setSelected(["Hidden"]);
                  }}
                >
                  {isSetDate ? "Clear date..." : "Set visibility date"}
                </Button>
              </div>
            </LegacyCard>

            <LegacyCard title="Online store" sectioned>
              <Select
                label="Theme template"
                options={options}
                onChange={handleThemeChange}
                value={theme}
              />
              <div style={{ marginTop: "16px" }}>
                <Text>
                  Assign a template from your current theme to define how the
                  page is displayed.
                </Text>
              </div>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </Form>
    </Page>
  );
}

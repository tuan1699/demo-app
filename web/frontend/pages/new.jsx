import { useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";
import {
  Banner,
  Button,
  ButtonGroup,
  ChoiceList,
  Divider,
  Form,
  Layout,
  LegacyCard,
  Page,
  Select,
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
import {
  DueDatePicker,
  DueTimePicker,
  ModalConfirm,
  SearchEngine,
} from "../components";

export default function CreatePage() {
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState("today");
  const handleTitleChange = useCallback((value) => {
    setTitle(value);
    setIsError(false);
  }, []);
  const handleContentChange = useCallback((value) => setContent(value), []);
  const [visibleStatus, setVisibleStatus] = useState(["Visible"]);
  const [isSetDate, setIsSetDate] = useState(false);
  const [isError, setIsError] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [loading, setLoading] = useState(false);

  const options = [
    { label: "Default", value: "today" },
    { label: "contact", value: "contact" },
  ];
  const handleThemeChange = useCallback((value) => setTheme(value), []);

  const handleChange = useCallback((value) => {
    console.log(value);
    setVisibleStatus(value);
    if (value.toString() === "Visible") {
      setIsSetDate(false);
    }
  }, []);

  const handleCreatePage = () => {
    if (title.trim() === "") {
      setIsError(true);
    } else {
      // const publishedDate = new Date().toLocaleDateString();
      setLoading(true);
      const newPage = {
        title: title,
        body_html: content,
        // published:
        //   visibleStatus?.toString() !== "Visible" ? null : publishedDate,
      };
      console.log(newPage);
      fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: newPage,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          console.log("OKE");
          console.log(data);
          navigate(`/${data.id}`);
        })
        .catch((err) => {
          console.log("NOT OK");
          console.log(err);
        });
    }
  };

  return (
    <Page
      backAction={{
        onAction: () => {
          navigate("/");
          // setConfirmLeave(true);
        },
      }}
      title="Add page"
    >
      {isError && (
        <div style={{ marginBottom: "16px" }}>
          <Banner title="There is 1 error:" status="critical">
            <li>Title can't be blank</li>
          </Banner>
        </div>
      )}

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
                error={isError ? "Store name is required" : null}
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
            <SearchEngine title={title} content={content} />
          </Layout.Section>

          <Layout.Section secondary>
            <LegacyCard title="Visibility" sectioned>
              <ChoiceList
                choices={[
                  {
                    label:
                      visibleStatus?.toString() === `Visible`
                        ? `Visible (as of ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()})`
                        : `Visible`,
                    value: "Visible",
                  },
                  { label: "Hidden", value: "Hidden" },
                ]}
                selected={visibleStatus}
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
                    setVisibleStatus(["Hidden"]);
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

      <div style={{ margin: "20px 0px" }}>
        <Divider borderStyle="divider" />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ButtonGroup>
          <Button onClick={() => console.log("Cancel")}>Cancel</Button>
          <Button
            primary
            onClick={handleCreatePage}
            disabled={
              title.trim() !== "" || content.trim() !== "" ? false : true
            }
            loading={loading}
          >
            Save
          </Button>
        </ButtonGroup>
      </div>

      {confirmLeave && <ModalConfirm />}
    </Page>
  );
}

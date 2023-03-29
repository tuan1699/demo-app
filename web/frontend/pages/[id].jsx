import { useParams } from "react-router-dom";
import React, { useState, useCallback, useRef } from "react";
import { useAppQuery } from "../hooks";

import { useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";
import {
  Badge,
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
import {
  ContentFormater,
  DueDatePicker,
  DueTimePicker,
  ModalComp,
  SearchEngine,
  SkeletonDetail,
  ToastMessage,
} from "../components";
import { isChangeData } from "../ulities/isChangeData";

export default function PageEdit() {
  const fetch = useAuthenticatedFetch();

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    contentAction: "",
  });

  const navigate = useNavigate();
  const [initData, setInitData] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState("today");
  const handleTitleChange = useCallback((value) => setTitle(value), []);
  const handleContentChange = useCallback((value) => setContent(value), []);
  const [visibleStatus, setVisibleStatus] = useState(["Visible"]);
  const [initVisible, setInitVisible] = useState([]);
  const [isSetDate, setIsSetDate] = useState(false);
  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
  });
  const editorRef = useRef(null);

  const { data, refetch } = useAppQuery({
    url: `/api/pages?id=${id}`,
    reactQueryOptions: {
      onSuccess: (data) => {
        console.log(data);
        setInitData(data);
        setTitle(data.title);
        setContent(data.body_html);
        setVisibleStatus(data.published_at ? ["Visible"] : ["Hidden"]);
        setInitVisible(data.published_at ? ["Visible"] : ["Hidden"]);
        setIsLoading(false);
      },
      onError: (error) => {
        console.log(error);
      },
    },
  });

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

  const handleUpdatePage = () => {
    const updatedData = {
      title: title,
      body_html: content,
      published: visibleStatus?.toString() !== "Visible" ? null : true,
    };
    setLoadingUpdate(true);
    console.log(updatedData);
    fetch(`/api/pages?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("OK");
        refetch();
        console.log(data);
        setLoadingUpdate(false);
        setToast({
          ...toast,
          isOpen: true,
          message: "Page was saved",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeletePage = async () => {
    const res = await fetch(`/api/pages?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      console.log("OK");
      setConfirmModal({
        ...confirmModal,
        loading: false,
      });
      setToast({
        ...toast,
        isOpen: true,
        message: "Deleted 1 page",
      });
      setTimeout(() => {
        navigate("/");
      }, 500);
    } else {
      console.log("NOT OK");
    }
  };

  if (isLoading) return <SkeletonDetail />;

  return (
    <Page
      backAction={{
        onAction: () => {
          console.log("check");
          if (
            title.trim() !== initData.title ||
            editorRef.current.innerHTML !== initData.body_html
          ) {
            setConfirmModal({
              ...confirmModal,
              isOpen: true,
              title: "You have unsaved changes",
              subTitle:
                "If you leave this page, all unsaved changes will be lost.",
              contentAction: "Leave page",
              onConfirm: () => navigate("/"),
            });
          } else {
            navigate("/");
          }
        },
      }}
      title={data && data.title}
      titleMetadata={data && data.published_at ? null : <Badge>Hidden</Badge>}
      secondaryActions={[
        { content: "Duplicate", icon: DuplicateMinor },
        {
          content: "Preview page",
          icon: ViewMajor,
          onAction: () =>
            navigate(
              `https://first-store-byt.myshopify.com/pages/${initData.handle}`
            ),
        },
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
              <ContentFormater
                content={content}
                handleContentChange={handleContentChange}
                editorRef={editorRef}
              />
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
                        ? `Visible ${
                            initData.published_at
                              ? `(as of ${new Date(
                                  initData.published_at
                                ).toLocaleDateString()}, ${new Date(
                                  initData.published_at
                                )
                                  .toLocaleTimeString()
                                  .slice(0, 4)} ${new Date()
                                  .toLocaleTimeString()
                                  .slice(-3)} EDT)`
                              : ""
                          }`
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
          <Button
            onClick={() =>
              setConfirmModal({
                ...confirmModal,
                isOpen: true,
                title: `Delete ${title}`,
                subTitle: `Delete "${title}"? This
                can't be undone.`,
                contentAction: "Delete",
                onConfirm: () => handleDeletePage(),
              })
            }
            outline
            destructive
          >
            Delete page
          </Button>
          <Button
            primary
            disabled={
              title.trim() !== initData.title ||
              // editorRef.current.innerHTML !== initData.body_html ||
              initVisible.toString() !== visibleStatus.toString()
                ? false
                : true
            }
            onClick={() => {
              handleUpdatePage();
            }}
            loading={loadingUpdate}
          >
            Save
          </Button>
        </ButtonGroup>
      </div>
      {confirmModal.isOpen && (
        <ModalComp
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
        />
      )}
      {toast.isOpen && <ToastMessage toast={toast} setToast={setToast} />}
    </Page>
  );
}

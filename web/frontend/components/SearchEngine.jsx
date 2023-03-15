import { LegacyCard, Text, TextField } from "@shopify/polaris";
import React, { useCallback, useState } from "react";

export function SearchEngine() {
  const [editWithSeo, setEditWithSeo] = useState(false);
  const [titleSeo, setTitleSeo] = useState("");
  const [descrSeo, setDecrSeo] = useState("");
  const [urlSeo, setUrlSeo] = useState("");

  const handleChangeTitleSeo = useCallback((value) => {
    setTitleSeo(value);
  }, []);

  const handleChangeDecrSeo = useCallback((value) => {
    setDecrSeo(value);
  }, []);

  const handleChangeUrlSeo = useCallback((value) => {
    setUrlSeo(value);
  });
  return (
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
        {titleSeo.trim() !== "" && descrSeo.trim() !== "" ? (
          <div>
            <p style={{ fontSize: "18px", color: "#1a0dab" }}>{titleSeo}</p>
            <Text
              color="success"
              as="h6"
            >{`https://first-store-byt.myshopify.com/pages/${urlSeo}`}</Text>
            <p style={{ fontSize: "13px" }}>{descrSeo}</p>
          </div>
        ) : (
          <p>
            {` Add ${titleSeo.trim() !== "" ? "" : "a title"} ${
              titleSeo.trim() === "" && descrSeo.trim() === "" ? "and" : ""
            }  ${
              descrSeo.trim() !== "" ? "" : "description"
            } to see how this Page might appear in a
            search engine listing`}
          </p>
        )}
      </LegacyCard.Section>
      {editWithSeo && (
        <LegacyCard.Section>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              label="Page title"
              type="text"
              value={titleSeo}
              onChange={handleChangeTitleSeo}
              helpText={`${titleSeo.length} of 70 characters used`}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              label="Description"
              multiline={4}
              value={descrSeo}
              onChange={handleChangeDecrSeo}
              helpText={`${descrSeo.length} of 320 characters used`}
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
  );
}

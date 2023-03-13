import {
  Avatar,
  Button,
  LegacyCard,
  ChoiceList,
  Filters,
  Popover,
  ResourceItem,
  ResourceList,
  Tabs,
  Spinner,
  Text,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import {
  FavoriteMajor,
  SortMinor,
  StarOutlineMinor,
} from "@shopify/polaris-icons";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { validDate } from "../ulities/validDate";

export function PagesControl() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [queryValue, setQueryValue] = useState("");
  const [visibleStatus, setVisibleStatus] = useState(null);
  const [popoverActive, setPopoverActive] = useState(false);
  const [sortList, setSortList] = useState(null);
  const [tabList, setTabList] = useState([
    {
      id: "all-customers-1",
      content: "All",
      accessibilityLabel: "All customers",
      panelID: "all-customers-content-1",
    },
  ]);
  const [tabSelected, setTabSelected] = useState(0);
  const [loading, setLoading] = useState(true);

  const { data, isLoading, isError, error } = useAppQuery({
    url: "/api/pages",
    reactQueryOptions: {
      onSuccess: () => {
        setLoading(false);
      },
    },
  });

  const handleTabChange = useCallback((selectedTabIndex) => {
    if (selectedTabIndex === 0) {
      const newTabs = [...tabList];
      newTabs.splice(1, 1);
      setTabList(newTabs);
      setTabSelected(selectedTabIndex);
      handleRemoveVisibleStatus();
    }
  }, []);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  // Sort Button
  const activator = (
    <Button icon={SortMinor} onClick={togglePopoverActive} disclosure>
      Sort
    </Button>
  );

  const handleFiltersQueryChange = useCallback((value) => {
    setQueryValue(value);
  }, []);

  const handleQueryValueRemove = useCallback(() => {
    setQueryValue("");
  }, []);

  const handleVisibleStatusChange = useCallback((value) => {
    setVisibleStatus(value);
    const newTab = {
      id: "customl-search",
      content: "Custom search",
      accessibilityLabel: "Custom search",
      panelID: "customl-search",
    };
    const newTabs = [...tabList, newTab];
    setTabList(newTabs);
    setTabSelected(1);
  }, []);

  const handleRemoveVisibleStatus = useCallback(() => {
    setVisibleStatus(null);
    const newTabs = [...tabList];
    if (newTabs.length !== 1) {
      newTabs.splice(1, 1);
      setTabList(newTabs);
      setTabSelected(0);
    }
  }, [tabList]);

  const handleSortChange = useCallback((value) => {
    setSortList(value);
  }, []);

  const handleClearAll = useCallback(() => {
    handleRemoveVisibleStatus();
    handleQueryValueRemove();
  }, [handleRemoveVisibleStatus]);

  const resourceName = {
    singular: "page",
    plural: "pages",
  };

  const bulkActions = [
    {
      content: "Make selected pages visible",
      onAction: () => console.log("Todo: implement bulk add tags"),
    },
    {
      content: "Hide selected pages",
      onAction: () => console.log("Todo: implement bulk remove tags"),
    },
    {
      content: (
        <Button plain destructive>
          Delete Pages
        </Button>
      ),
      onAction: () => console.log("Todo: implement bulk delete"),
    },
  ];

  const filters = [
    {
      key: "visiable",
      label: "Visibility",
      filter: (
        <ChoiceList
          title="Visible status"
          titleHidden
          choices={[
            { label: "Visible", value: "Visible" },
            { label: "Hidden", value: "Hidden" },
          ]}
          selected={visibleStatus || []}
          onChange={handleVisibleStatusChange}
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = !isEmpty(visibleStatus)
    ? [
        {
          key: "visiable",
          label: disambiguateLabel("visiable", visibleStatus),
          onRemove: handleRemoveVisibleStatus,
        },
      ]
    : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={handleFiltersQueryChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      <div style={{ paddingLeft: "8px", display: "flex", gap: "8px" }}>
        <Button
          disabled={visibleStatus ? false : true}
          icon={visibleStatus ? StarOutlineMinor : FavoriteMajor}
          onClick={() => console.log("New filter saved")}
        >
          {visibleStatus ? "Save Filter" : "Saved"}
        </Button>
        <Popover
          active={popoverActive}
          activator={activator}
          autofocusTarget="first-node"
          onClose={togglePopoverActive}
          preferredAlignment="right"
        >
          <Popover.Pane>
            <div style={{ padding: "16px" }}>
              <ChoiceList
                title="Sort by"
                choices={[
                  { label: "Newest update", value: "newest" },
                  { label: "Oldest update", value: "oldest" },
                  { label: "Title A-Z", value: "az" },
                  { label: "Title Z-A", value: "za" },
                ]}
                selected={sortList || []}
                onChange={handleSortChange}
                hideClearButton
              />
            </div>
          </Popover.Pane>
        </Popover>
      </div>
    </Filters>
  );

  return (
    <LegacyCard>
      <Tabs tabs={tabList} selected={tabSelected} onSelect={handleTabChange}>
        <LegacyCard>
          {data?.length === 0 || data === undefined || isLoading ? (
            <div
              style={{
                width: "100%",
                margin: "30px auto",
                textAlign: "center",
              }}
            >
              <Spinner accessibilityLabel="Spinner example" size="large" />
            </div>
          ) : (
            <ResourceList
              resourceName={resourceName}
              items={data}
              renderItem={renderItem}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              bulkActions={bulkActions}
              filterControl={filterControl}
            />
          )}
        </LegacyCard>
      </Tabs>
    </LegacyCard>
  );

  function renderItem(item) {
    const { id, title, created_at, body_html, admin_graphql_api_id } = item;
    const shortcutActions = admin_graphql_api_id
      ? [{ content: "View Page", url: admin_graphql_api_id }]
      : null;
    return (
      <ResourceItem id={id} shortcutActions={shortcutActions}>
        <Text as="h3" variant="bodyMd" fontWeight="semibold">
          {title}
        </Text>
        {body_html && (
          <Text as="p" variant="bodyMd" color="subdued" fontWeight="regular">
            {body_html}
          </Text>
        )}
        <Text as="p" variant="bodyMd" color="subdued" fontWeight="regular">
          {validDate(created_at)}
        </Text>
      </ResourceItem>
    );
  }

  function disambiguateLabel(key, value) {
    switch (key) {
      case "visiable":
        return `Visibility is ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}

import {
  Button,
  LegacyCard,
  ChoiceList,
  Filters,
  Popover,
  ResourceItem,
  ResourceList,
  Tabs,
  Spinner,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import {
  FavoriteMajor,
  SortMinor,
  StarOutlineMinor,
} from "@shopify/polaris-icons";
import { useAppQuery } from "../hooks";
import { TextFilter } from "./TextFilter";
import { PageItem } from "./PageItem";
import { ModalConfirm } from "./ModalConfirm";
import { EmptyStatePage } from "./EmptyState";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";

export function PagesControl() {
  const fetch = useAuthenticatedFetch();
  const [selectedPages, setSelectedPages] = useState([]);
  const [queryValue, setQueryValue] = useState("");
  const [visibleStatus, setVisibleStatus] = useState(null);
  const [popoverSortActive, setPopoverSortActive] = useState(false);
  const [popoverSaveActive, setPopoverSaveActive] = useState(false);
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
  const [isLoadingState, setIsLoading] = useState(true);

  const [activeModal, setActiveModal] = useState(false);
  const handleActiveModal = useCallback(() => {
    setActiveModal(!activeModal);
  }, [activeModal]);

  const { data, isLoading, error, refetch } = useAppQuery({
    url: `/api/pages?published_status=${visibleStatus}`,
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
        console.log("test loading");
      },
      onError: (error) => {
        console.log(error);
      },
    },
  });

  const handleHiddenPages = async (status) => {
    const { published } = status;
    console.log(published);
    setIsLoading(true);
    const res = await fetch(`/api/pages?id=${selectedPages.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        published: published,
      }),
    });

    if (res.ok) {
      setSelectedPages([]);
      refetch();
      console.log("OK");
    } else {
      console.log("NOT OK");
    }
  };

  const handleTabChange = useCallback((selectedTabIndex) => {
    if (selectedTabIndex === 0) {
      const newTabs = [...tabList];
      newTabs.splice(1);
      setTabList(newTabs);
      setTabSelected(selectedTabIndex);
      handleRemoveVisibleStatus();
    }
  }, []);

  const togglePopoverSortActive = useCallback(
    () => setPopoverSortActive((popoverSortActive) => !popoverSortActive),
    []
  );

  const togglePopoverSaveActive = useCallback(
    () => setPopoverSaveActive((popoverSaveActive) => !popoverSaveActive),
    []
  );

  // Sort Button
  const sortBtn = (
    <Button icon={SortMinor} onClick={togglePopoverSortActive} disclosure>
      Sort
    </Button>
  );

  const saveBtn = (
    <Button
      disabled={visibleStatus ? false : true}
      icon={visibleStatus ? StarOutlineMinor : FavoriteMajor}
      onClick={togglePopoverSaveActive}
      disclosure
    >
      {visibleStatus ? "Save Filter" : "Saved"}
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
      onAction: () => {
        handleHiddenPages({
          published: true,
        });
      },
    },
    {
      content: "Hide selected pages",
      onAction: () => {
        handleHiddenPages({
          published: false,
        });
      },
    },
    {
      content: (
        <Button plain destructive>
          Delete Pages
        </Button>
      ),
      onAction: () => setActiveModal(!activeModal),
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
            { label: "Visible", value: "published" },
            { label: "Hidden", value: "unpublished" },
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
        <Popover
          active={popoverSaveActive}
          activator={saveBtn}
          autofocusTarget="first-node"
          onClose={togglePopoverSaveActive}
          preferredAlignment="right"
        >
          <Popover.Pane>
            <div style={{ padding: "16px", width: "380px", height: "auto" }}>
              <TextFilter
                tagname={visibleStatus}
                togglePopoverSaveActive={togglePopoverSaveActive}
              />
            </div>
          </Popover.Pane>
        </Popover>
        <Popover
          active={popoverSortActive}
          activator={sortBtn}
          autofocusTarget="first-node"
          onClose={togglePopoverSortActive}
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
    <>
      <LegacyCard>
        {data === undefined ? (
          <div
            style={{
              width: "100%",
              margin: "30px auto",
              textAlign: "center",
            }}
          >
            <Spinner accessibilityLabel="Spinner example" size="large" />
          </div>
        ) : data && data?.length === 0 && !visibleStatus ? (
          <EmptyStatePage />
        ) : (
          <>
            <Tabs
              tabs={tabList}
              selected={tabSelected}
              onSelect={handleTabChange}
            >
              <LegacyCard>
                <ResourceList
                  resourceName={resourceName}
                  items={data}
                  renderItem={renderItem}
                  selectedItems={selectedPages}
                  onSelectionChange={setSelectedPages}
                  bulkActions={bulkActions}
                  filterControl={filterControl}
                  loading={isLoadingState ? true : false}
                />
                {activeModal && (
                  <ModalConfirm
                    selectedPages={selectedPages}
                    handleActiveModal={handleActiveModal}
                    setIsLoading={setIsLoading}
                    refetch={refetch}
                    setSelectedPages={setSelectedPages}
                  />
                )}
              </LegacyCard>
            </Tabs>
          </>
        )}
      </LegacyCard>
    </>
  );

  function renderItem(item) {
    const {
      id,
      title,
      created_at,
      body_html,
      admin_graphql_api_id,
      published_at,
    } = item;
    const shortcutActions = admin_graphql_api_id
      ? [{ content: "View Page", url: admin_graphql_api_id }]
      : null;
    return (
      <ResourceItem id={id} shortcutActions={shortcutActions} url={`/${id}`}>
        <PageItem
          id={id}
          shortcutActions={shortcutActions}
          body_html={body_html}
          created_at={created_at}
          visibleStatus={visibleStatus}
          title={title}
          published_at={published_at}
        />
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

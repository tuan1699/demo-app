import {
  AlphaStack,
  Button,
  OptionList,
  Popover,
} from "@shopify/polaris";
import { ClockMajor } from "@shopify/polaris-icons";
import React, { useState } from "react";

export function DueTimePicker() {
  const ranges = [
    {
      title: "5:00 AM",
      alias: "5am",
      period: "5am",
    },
    {
      title: "5:30 AM",
      alias: "5.5am",
      period: "5.5am",
    },
    {
      title: "6:00 AM",
      alias: "6am",
      period: "6am",
    },
    {
      title: "6:30 AM",
      alias: "6.5am",
      period: "6.5am",
    },
    {
      title: "7:00 AM",
      alias: "7am",
      period: "7am",
    },
    {
      title: "7:30 AM",
      alias: "7.5am",
      period: "7.5am",
    },
    {
      title: "8:00 AM",
      alias: "8am",
      period: "8am",
    },
    {
      title: "8:30 AM",
      alias: "8.5am",
      period: "8.5am",
    },
    {
      title: "9:00 AM",
      alias: "9am",
      period: "9am",
    },
  ];
  const [selected, setSelected] = useState(ranges[0]);
  const [popoverActive, setPopoverActive] = useState(false);

  return (
    <AlphaStack gap="4">
      <Popover
        fullWidth
        autofocusTarget="none"
        preferredAlignment="left"
        preferInputActivator={false}
        preferredPosition="below"
        activator={
          <Button
            onClick={() => setPopoverActive(!popoverActive)}
            icon={ClockMajor}
            fullWidth
            textAlign="start"
          >
            <p style={{ marginLeft: "6px" }}>{selected.title}</p>
          </Button>
        }
        active={popoverActive}
      >
        <OptionList
          options={ranges.map((range) => ({
            value: range.alias,
            label: range.title,
          }))}
          selected={selected.alias}
          onChange={(value) => {
            setSelected(ranges.find((range) => range.alias === value[0]));
            setPopoverActive(false);
          }}
        />
      </Popover>
    </AlphaStack>
  );
}

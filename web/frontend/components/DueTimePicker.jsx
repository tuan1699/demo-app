import { AlphaStack, Button, OptionList, Popover } from "@shopify/polaris";
import { ClockMajor } from "@shopify/polaris-icons";
import React, { useState } from "react";
import { ranges } from "../ulities/initData";

export function DueTimePicker() {
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

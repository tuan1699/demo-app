import {
  AlphaCard,
  AlphaStack,
  Box,
  DatePicker,
  Icon,
  Popover,
  TextField,
} from "@shopify/polaris";
import { CalendarMinor } from "@shopify/polaris-icons";
import React, { useEffect, useRef, useState } from "react";

export function DueDatePicker() {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [{ month, year }, setDate] = useState({
    month: selectedDate.getMonth(),
    year: selectedDate.getFullYear(),
  });

  const formattedValue = selectedDate.toISOString().slice(0, 10);
  const datePickerRef = useRef(null);

  //   function isNodeWithinPopover(node) {
  //     return datePickerRef?.current
  //       ? nodeContainsDescendant(datePickerRef.current, node)
  //       : false;
  //   }

  function handleInputValueChange() {
    console.log("handleInputValueChange");
  }
  function handleOnClose({ relatedTarget }) {
    setVisible(false);
  }
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }
  function handleDateSelection({ end: newSelectedDate }) {
    setSelectedDate(newSelectedDate);
    setVisible(false);
  }
  useEffect(() => {
    if (selectedDate) {
      setDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
      });
    }
  }, [selectedDate]);

  //   function nodeContainsDescendant(rootNode, descendant) {
  //     if (rootNode === descendant) {
  //       return true;
  //     }
  //     let parent = descendant.parentNode;
  //     while (parent != null) {
  //       if (parent === rootNode) {
  //         return true;
  //       }
  //       parent = parent.parentNode;
  //     }
  //     return false;
  //   }

  return (
    <AlphaStack gap="4">
      <Box>
        <Popover
          active={visible}
          autofocusTarget="none"
          preferredAlignment="left"
          fullWidth
          preferInputActivator={false}
          preferredPosition="above"
          preventCloseOnChildOverlayClick
          onClose={handleOnClose}
          activator={
            <TextField
              role="combobox"
              label={"Visibility date"}
              prefix={<Icon source={CalendarMinor} />}
              value={formattedValue}
              onFocus={() => setVisible(true)}
              onChange={handleInputValueChange}
              autoComplete="off"
            />
          }
        >
          <AlphaCard ref={datePickerRef}>
            <DatePicker
              month={month}
              year={year}
              selected={selectedDate}
              onMonthChange={handleMonthChange}
              onChange={handleDateSelection}
            />
          </AlphaCard>
        </Popover>
      </Box>
    </AlphaStack>
  );
}

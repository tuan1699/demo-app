import {
  ActionList,
  Button,
  ButtonGroup,
  ColorPicker,
  LegacyCard,
  Popover,
  Text,
  TextField,
  Tooltip,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";

import { TypeMinor } from "@shopify/polaris-icons";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaOutdent,
  FaIndent,
} from "react-icons/fa";
import { MdFormatColorText } from "react-icons/md";

export function ContentFormater({ content, handleContentChange }) {
  const [activeHeading, setActiveHeading] = useState(false);
  const [activeAlign, setActiveAlign] = useState(false);
  const [activePickColor, setActivePickColor] = useState(false);
  const toggleHeading = useCallback(
    () => setActiveHeading((activeHeading) => !activeHeading),
    []
  );
  const toggleAlign = useCallback(
    () => setActiveAlign((activeAlign) => !activeAlign),
    []
  );
  const togglePickColor = useCallback(
    () => setActivePickColor((activePickColor) => !activePickColor),
    []
  );

  const [color, setColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
  });

  const activatorHeading = (
    <Tooltip content="Formatting" dismissOnMouseOut>
      <Button icon={TypeMinor} onClick={toggleHeading} disclosure />
    </Tooltip>
  );

  const activatorAlign = (
    <Tooltip content="Alignment" dismissOnMouseOut>
      <Button icon={<FaAlignLeft />} onClick={toggleAlign} disclosure />
    </Tooltip>
  );

  const activatorPickColor = (
    <Tooltip content="Color" dismissOnMouseOut>
      <Button
        icon={<MdFormatColorText />}
        onClick={togglePickColor}
        disclosure
      />
    </Tooltip>
  );

  return (
    <div style={{ marginTop: "16px" }}>
      <Text>Content</Text>
      <LegacyCard>
        <LegacyCard>
          <div style={{ display: "flex", gap: "8px", padding: "8px" }}>
            {/* <Button icon={TypeMinor} /> */}
            <ButtonGroup segmented>
              <div>
                <Popover
                  active={activeHeading}
                  activator={activatorHeading}
                  autofocusTarget="first-node"
                  onClose={toggleHeading}
                >
                  <ActionList
                    actionRole="menuitem"
                    items={[
                      {
                        content: "Paragraph",
                      },
                      {
                        content: "Heading 1",
                      },
                      {
                        content: "Heading 2",
                      },
                      {
                        content: "Heading 3",
                      },
                      {
                        content: "Heading 4",
                      },
                      {
                        content: "Heading 5",
                      },
                      {
                        content: "Heading 6",
                      },
                    ]}
                  />
                </Popover>
              </div>
              <Tooltip content="Bold" dismissOnMouseOut>
                <Button icon={<FaBold />} />
              </Tooltip>
              <Tooltip content="Italic" dismissOnMouseOut>
                <Button icon={<FaItalic />} />
              </Tooltip>
              <Tooltip content="Underline" dismissOnMouseOut>
                <Button icon={<FaUnderline />} />
              </Tooltip>
            </ButtonGroup>
            <ButtonGroup segmented>
              <Tooltip content="Bulleted list" dismissOnMouseOut>
                <Button icon={<FaListUl />} />
              </Tooltip>

              <Tooltip content="Numbered list" dismissOnMouseOut>
                <Button icon={<FaListOl />} />
              </Tooltip>

              <Tooltip content="Outdent" dismissOnMouseOut>
                <Button icon={<FaOutdent />} />
              </Tooltip>

              <Tooltip content="Indent" dismissOnMouseOut>
                <Button icon={<FaIndent />} />
              </Tooltip>
            </ButtonGroup>

            <ButtonGroup segmented>
              <div>
                <Popover
                  active={activeAlign}
                  activator={activatorAlign}
                  autofocusTarget="first-node"
                  onClose={toggleAlign}
                >
                  <ActionList
                    actionRole="menuitem"
                    items={[
                      {
                        content: "Left align",
                        // onAction: handleImportedAction,
                      },
                      {
                        content: "Center align",
                        // onAction: handleExportedAction,
                      },
                      {
                        content: "Right align",
                        // onAction: handleExportedAction,
                      },
                    ]}
                  />
                </Popover>
              </div>
              <div>
                <Popover
                  active={activePickColor}
                  activator={activatorPickColor}
                  autofocusTarget="first-node"
                  onClose={togglePickColor}
                >
                  <ColorPicker onChange={setColor} color={color} />
                </Popover>
              </div>
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
  );
}

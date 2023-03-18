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
import React, { useCallback, useRef, useState } from "react";

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
  const editorRef = useRef(null);

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

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  function handleCommand(command, value) {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  }

  return (
    <div style={{ marginTop: "16px" }}>
      <Text>Content</Text>
      <LegacyCard>
        <LegacyCard>
          <div style={{ display: "flex", gap: "8px", padding: "8px" }}>
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
                        onAction: () => {
                          handleCommand("insertParagraph", "p");
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 1",
                        onAction: () => {
                          handleCommand("formatBlock", "h1");
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 2",
                        onAction: () => {
                          handleCommand("formatBlock", "h2");
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 3",
                        onAction: () => {
                          handleCommand("formatBlock", "h3");
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 4",
                        onAction: () => {
                          handleCommand("formatBlock", "h4");
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 5",
                        onAction: () => {
                          handleCommand("formatBlock", "h5");
                          setActiveHeading(false);
                        },
                      },
                      {
                        content: "Heading 6",
                        onAction: () => {
                          handleCommand("formatBlock", "h6");
                          setActiveHeading(false);
                        },
                      },
                    ]}
                  />
                </Popover>
              </div>
              <Tooltip content="Bold" dismissOnMouseOut>
                <Button
                  icon={<FaBold />}
                  onClick={() => handleFormat("bold")}
                />
              </Tooltip>
              <Tooltip content="Italic" dismissOnMouseOut>
                <Button
                  icon={<FaItalic />}
                  onClick={() => handleFormat("italic")}
                />
              </Tooltip>
              <Tooltip content="Underline" dismissOnMouseOut>
                <Button
                  icon={<FaUnderline />}
                  onClick={() => handleFormat("underline")}
                />
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
                        onAction: () => handleCommand("justifyLeft"),
                      },
                      {
                        content: "Center align",
                        onAction: () => handleCommand("justifyCenter"),
                      },
                      {
                        content: "Right align",
                        onAction: () => handleCommand("justifyRight"),
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
          <div
            ref={editorRef}
            contentEditable
            className="editor-container"
            spellCheck="false"
            value={content}
            style={{
              border: "2px solid #ccc",
              padding: "5px",
              lineHeight: "1.6",
              outline: "none",
            }}
          ></div>
        </LegacyCard.Subsection>
      </LegacyCard>
    </div>
  );
}

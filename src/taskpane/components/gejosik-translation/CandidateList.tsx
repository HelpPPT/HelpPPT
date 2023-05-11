import * as React from "react";
import { List } from "@fluentui/react";

// Define the data for the ListBox
const listBoxData = [
  { id: 1, text: "Item 1" },
  { id: 2, text: "Item 2" },
  { id: 3, text: "Item 3" },
  // Add more items as needed
];

const ListBoxExample: React.FC = () => {
  const renderItem = React.useCallback((item?: { id: number; text: string }) => {
    if (!item) {
      return null;
    }

    return (
      <div style={{ display: "flex", alignItems: "center", padding: "8px" }}>
        <span>{item.text}</span>
        <input type="checkbox" style={{ marginRight: "8px" }} />
      </div>
    );
  }, []);

  return <List items={listBoxData} onRenderCell={renderItem} className="listBox" />;
};

export default ListBoxExample;

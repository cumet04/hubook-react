import React from "react";

export default function () {
  const items = ["item1", "item2", "item3"];
  return (
    <div>
      <ol>
        {items.map((item) => (
          <li>{item}</li>
        ))}
      </ol>
    </div>
  );
}

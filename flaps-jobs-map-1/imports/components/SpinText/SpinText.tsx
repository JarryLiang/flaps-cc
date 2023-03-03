import React from "react";
import {Spin} from "antd";

export function SpinText({ title }) {
  return (
    <div>
      <Spin />
      <span>{title}</span>
    </div>
  );
}

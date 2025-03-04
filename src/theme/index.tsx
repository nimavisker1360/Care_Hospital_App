import React from "react";
import { ConfigProvider } from "antd";

function ThemePrivider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#16423C",
          borderRadius: 2,
          controlOutline: "none",
        },
        components: {
          Button: {
            controlHeight: 45,
            defaultBorderColor: "#16423C",
          },
          Select: {
            controlHeight: 45,
          },
          Input: {
            controlHeight: 45,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default ThemePrivider;

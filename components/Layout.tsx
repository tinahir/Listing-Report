/** @jsxImportSource theme-ui */
import { jsx } from "theme-ui";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  header?: ReactNode;
};
export default function Layout({ children, header }: Props) {
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        variant: "layout.root",
      }}
    >
      <header
        sx={{
          variant: "styles.header",
          bg: "dark",
          mb: 4,
          px: 3,
        }}
      >
        {header && header}
      </header>
      <main
        sx={{
          width: "100%",
          flex: "1 1 auto",
          variant: "layout.main",
          px: 3,
          pb: 3,
        }}
      >
        <div
          sx={{
            maxWidth: 768,
            mx: "auto",
            variant: "layout.container",
            height: "100%",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

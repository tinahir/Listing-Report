/** @jsxImportSource theme-ui */
import { Link, jsx, Image, Themed } from "theme-ui";
import { ReactNode } from "react";

type Props = {
  defaultBackHref?: string;
  renderBackButton?: () => ReactNode;
};
export default function Header({
  defaultBackHref = "/",
  renderBackButton,
}: Props) {
  return (
    <div
      sx={{
        maxWidth: 768,
        mx: "auto",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Link
        href={defaultBackHref}
        sx={{
          variant: "styles.navlink",
          fontSize: 5,
          py: 2,
        }}
      >
        {renderBackButton ? (
          renderBackButton()
        ) : (
          <Themed.h1
            sx={{
              fontSize: 5,
              color: "primary",
            }}
          >
            Auto Scout24
          </Themed.h1>
        )}
      </Link>
    </div>
  );
}

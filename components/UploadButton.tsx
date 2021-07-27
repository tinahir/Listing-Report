/** @jsxImportSource theme-ui */
import { useRef } from "react";
import { FC, ChangeEvent } from "react";
import { Button } from "theme-ui";

type Props = {
  onFile: (file: File) => void;
};
export const UploadButton: FC<Props> = ({ onFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileUploaded = event.target.files[0];
      onFile(fileUploaded);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        variant="links.button"
        mr={2}
        ml={4}
        mt={4}
        onClick={handleClick}
        sx={{ cursor: "pointer", color: "dark" }}
      >
        Upload File
      </Button>
      <input
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        sx={{ display: "none" }}
        ref={fileInputRef}
        type="file"
        name="myImage"
        onChange={handleChange}
      />
    </>
  );
};

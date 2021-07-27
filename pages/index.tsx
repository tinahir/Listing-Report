/** @jsxImportSource theme-ui */
import { Link, Themed, Text, Alert, Close } from "theme-ui";
import Head from "next/head";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { UploadButton } from "@/components/UploadButton";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(null);

  const handleFile = async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    try {
      await axios.post("/api/file", body);
      setIsFileUpload(true);
    } catch (e) {
      setFileUploadError(e);
    }
  };
  useEffect(() => {
    if (isFileUpload) {
      setTimeout(() => {
        setIsFileUpload(false);
      }, 3000);
    }
  }, [isFileUpload]);

  useEffect(() => {
    if (fileUploadError) {
      setTimeout(() => {
        setFileUploadError(null);
      }, 3000);
    }
  }, [fileUploadError]);

  return (
    <div>
      <Head>
        <title>Listing Report</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout header={<Header />}>
        <div
          sx={{
            pb: 3,
          }}
        >
          {isFileUpload && (
            <Alert
              sx={{
                bg: "green",
                color: "light",
              }}
            >
              File upload have been successfully
              <Close ml="auto" mr={-2} onClick={() => setIsFileUpload(false)} />
            </Alert>
          )}

          {fileUploadError && (
            <Alert
              sx={{
                bg: "red",
                color: "light",
              }}
            >
              Invalid file
              <Close
                ml="auto"
                mr={-2}
                onClick={() => setFileUploadError(null)}
              />
            </Alert>
          )}
          <Themed.h1
            sx={{
              fontSize: 6,
              pb: 3,
            }}
          >
            Listing Report
          </Themed.h1>
          <Text
            sx={{
              pb: 5,
              color: "gray-1",
            }}
          >
            The report should include: <br />- Average Listing Selling Price per
            Seller Type <br />- Distribution (in percent) of available cars by
            Make <br />- Average price of the 30% most contacted listings <br />
            - The Top 5 most contacted listings per Month
          </Text>
        </div>

        <Link href="/reports" variant="links.button">
          View Listing Report
        </Link>
        <UploadButton onFile={handleFile}></UploadButton>
      </Layout>
    </div>
  );
}

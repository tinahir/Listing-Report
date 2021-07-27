/** @jsxImportSource theme-ui */
import { InferGetStaticPropsType } from "next";
import axios from "axios";
import React from "react";
import { Grid, Box, Heading } from "theme-ui";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import NotFound from "@/pages/404";
import {
  currencyEUR,
  formateKM,
  formateMonth,
  formatePercentage,
} from "@/shared/stringUtility";
import {
  AverageSellingPrice,
  ContactedListingsByMonth,
  PercentageByMake,
  ReportDate,
} from "@/lib/type";

export default function ReportsPage({
  reportData,
  error,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (error) {
    return (
      <NotFound statusCode={500} title={`${error.code}: ${error.message}`} />
    );
  }

  if (!reportData) {
    return <NotFound title="This recipes could not be found" />;
  }

  const renderAveragePriceBySellerType = (
    averagePriceBySellerType: AverageSellingPrice[]
  ) => (
    <>
      <Heading my="3">Average Listing Selling Price per Seller Type</Heading>
      <Grid
        gap={0}
        columns={[2, "1fr 1fr"]}
        pb="1"
        bg="light"
        sx={{
          border: "2px solid black",
          borderRadius: 8,
        }}
      >
        <Box bg="primary" p="2" pl="4">
          Seller Type
        </Box>
        <Box bg="primary" p="2" pl="4">
          Average in Euro
        </Box>
        {averagePriceBySellerType.map((item) => (
          <React.Fragment key={item.sellerType}>
            <Box p="2" pl="4">
              {item.sellerType}
            </Box>
            <Box p="2" pl="4">
              {currencyEUR(item.price)}
            </Box>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
  const renderlistingsPercentageByMake = (
    listingsPercentageByMake: PercentageByMake[]
  ) => (
    <>
      <Heading my="3">
        Distribution (in percent) of available cars by Make
      </Heading>
      <Grid
        gap={0}
        columns={[2, "1fr 1fr"]}
        pb="1"
        bg="light"
        sx={{
          border: "2px solid black",
          borderRadius: 8,
        }}
      >
        <Box bg="primary" p="2" pl="4">
          Make
        </Box>
        <Box bg="primary" p="2" pl="4">
          Distrubution
        </Box>
        {listingsPercentageByMake.map((item: any) => (
          <React.Fragment key={item.make}>
            <Box p="2" pl="4">
              {item.make}
            </Box>
            <Box p="2" pl="4">
              {formatePercentage(item.percentage)}
            </Box>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );

  const renderContactedListingsByMonth = (
    contactedListingsByMonth: ContactedListingsByMonth
  ) => (
    <>
      <Heading my="3">The Top 5 most contacted listings per Month</Heading>
      {Object.entries(contactedListingsByMonth).map(([key, value]) => (
        <React.Fragment key={key}>
          <Heading as="h3" my="3">
            Month: {formateMonth(key)}
          </Heading>
          <Grid
            gap={0}
            columns={[6, "0.6fr 0.8fr 1fr 1fr 1fr 1fr"]}
            pb="1"
            bg="light"
            sx={{
              border: "2px solid black",
              borderRadius: 8,
            }}
          >
            <Box bg="primary" p="2" pl="4">
              Ranking
            </Box>
            <Box bg="primary" p="2" pl="4">
              Listing Id
            </Box>
            <Box bg="primary" p="2" pl="4">
              Make
            </Box>
            <Box bg="primary" p="2" pl="4">
              Selling Price
            </Box>
            <Box bg="primary" p="2" pl="4">
              Mileage
            </Box>
            <Box bg="primary" p="2" pl="4">
              Total Amount of Contacts
            </Box>
            {value.map((item, index: number) => (
              <React.Fragment key={item.id}>
                <Box p="2" pl="4">
                  {index + 1}
                </Box>
                <Box p="2" pl="4">
                  {item.id}
                </Box>
                <Box p="2" pl="4">
                  {item.make}
                </Box>
                <Box p="2" pl="4">
                  {currencyEUR(item.price)}
                </Box>
                <Box p="2" pl="4">
                  {formateKM(item.mileage)}
                </Box>
                <Box p="2" pl="4">
                  {item.contactCount}
                </Box>
              </React.Fragment>
            ))}
          </Grid>
        </React.Fragment>
      ))}
    </>
  );

  const renderAveragePriceMostContactedListings = (
    averagePriceMostContactedListings: number
  ) => (
    <>
      <Heading my="3">Average price of the 30% most contacted listings</Heading>
      <Grid
        gap={0}
        columns={[1, "1fr"]}
        pb="1"
        bg="light"
        sx={{
          border: "2px solid black",
          borderRadius: 8,
        }}
      >
        <Box bg="primary" p="2" pl="4">
          Average Price
        </Box>
        <Box p="2" pl="4">
          {currencyEUR(averagePriceMostContactedListings)}
        </Box>
      </Grid>
    </>
  );

  return (
    <Layout header={<Header />}>
      {renderAveragePriceBySellerType(reportData.averagePriceBySellerType)}
      {renderlistingsPercentageByMake(reportData.listingsPercentageByMake)}
      {renderAveragePriceMostContactedListings(
        reportData.averagePriceMostContactedListings
      )}
      {renderContactedListingsByMonth(reportData.contactedListingsByMonth)}
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const result = await axios.get("http://localhost:4000/api/listings");
    return {
      props: {
        reportData: result.data as ReportDate,
        error: null,
      },
    };
  } catch (e) {
    return {
      props: {
        reportData: null,
        error: e,
      },
    };
  }
}

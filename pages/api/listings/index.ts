import type { NextApiRequest, NextApiResponse } from "next";
import { reportManager } from "@/lib/report-manager";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await reportManager.init();
    const data = {
      averagePriceBySellerType: reportManager.averagePriceBySellerType(),
      listingsPercentageByMake: reportManager.listingsPercentageByMake(),
      averagePriceMostContactedListings:
        reportManager.averagePriceMostContactedListings(30),
      contactedListingsByMonth: reportManager.contactedListingsByMonth(5),
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
}

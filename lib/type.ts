export type AverageSellingPrice = {
  sellerType: string;
  price: number;
};

export type PercentageByMake = {
  make: string;
  percentage: number;
};

export type Listing = {
  id: number;
  make: string;
  price: number;
  mileage: number;
  sellerType: string;
};

export type Lead = {
  listingId: number;
  contactDate: number;
};

export type ListingWithContactCount = Listing & { contactCount: number };

export type ContactedListingsByMonth = Record<
  number,
  ListingWithContactCount[]
>;

export type ReportDate = {
  averagePriceBySellerType: AverageSellingPrice[];
  listingsPercentageByMake: PercentageByMake[];
  averagePriceMostContactedListings: number;
  contactedListingsByMonth: ContactedListingsByMonth;
};

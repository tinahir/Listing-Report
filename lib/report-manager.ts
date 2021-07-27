import { getContacts, getListing } from "./listings";
import {
  AverageSellingPrice,
  PercentageByMake,
  Lead,
  Listing,
  ListingWithContactCount,
} from "./type";

const groupByProps = <T>(
  map: Map<string, Array<T>>,
  car: T,
  props: keyof T
) => {
  let carProps = String(car[props]);
  let list = map.get(carProps);

  if (!list) {
    list = new Array<T>();
  }
  list.push(car);

  map.set(carProps, list);
};

class ReportManager {
  private listingById: Record<number, Listing>;
  private listingIds: Array<number>;

  private contactsByTime: Record<number, Lead>;
  private contactsIds: Array<number>;
  private groupContactByListingId: Map<string, Array<Lead>>;

  async init() {
    this.groupContactByListingId = new Map<string, Array<Lead>>();
    const listings = await getListing();
    this.listingById = listings.listingById;
    this.listingIds = listings.listingIds;

    const contacts = await getContacts();
    this.contactsByTime = contacts.contactsByTime;
    this.contactsIds = contacts.contactsIds;

    this.contactsIds.forEach((id) => {
      groupByProps<Lead>(
        this.groupContactByListingId,
        this.contactsByTime[id],
        "listingId"
      );
    });
  }

  averagePriceBySellerType() {
    const groupBySellerType = new Map<string, Array<Listing>>();
    this.listingIds.forEach((id) => {
      groupByProps<Listing>(
        groupBySellerType,
        this.listingById[id],
        "sellerType"
      );
    });

    const report = new Array<AverageSellingPrice>();
    groupBySellerType.forEach((values, key) => {
      const price = Number(
        (values.reduce((a, b) => a + b.price, 0) / values.length).toFixed()
      );
      report.push({ sellerType: key, price });
    });

    return report.sort((a, b) => b.price - a.price);
  }

  listingsPercentageByMake() {
    const groupByMake = new Map<string, Array<Listing>>();
    this.listingIds.forEach((id) => {
      groupByProps<Listing>(groupByMake, this.listingById[id], "make");
    });

    const report = new Array<PercentageByMake>();
    groupByMake.forEach((values, key) => {
      report.push({
        make: key,
        percentage: Number((values.length / this.listingIds.length).toFixed(2)),
      });
    });
    return report.sort((a, b) => b.percentage - a.percentage);
  }

  averagePriceMostContactedListings(percentage: number) {
    const report = new Array<{ listingId: number; contactedCount: number }>();
    this.groupContactByListingId.forEach((values, key) => {
      report.push({
        listingId: Number(key),
        contactedCount: values.length,
      });
    });
    report.sort((a, b) => b.contactedCount - a.contactedCount);

    return (() => {
      let totalPrice = 0;
      let totalPrecentage = 0;
      for (const { listingId, contactedCount } of report) {
        if (percentage >= totalPrecentage) {
          const contactedPercentage = Number(
            ((contactedCount * 100) / this.contactsIds.length).toFixed(2)
          );
          totalPrice += this.listingById[listingId].price;
          totalPrecentage += contactedPercentage;
        }
      }
      return totalPrice;
    })();
  }

  contactedListingsByMonth(top: number) {
    const groupContactByDate: Record<string, Record<number, number>> = {};
    this.contactsIds.forEach((id) => {
      let lead = this.contactsByTime[id];

      const contactDate = new Date(lead.contactDate);
      const generateDateKey = (() => {
        return (
          contactDate.getMonth() + 1 + contactDate.getFullYear().toString()
        );
      })();

      let listingMap = groupContactByDate[generateDateKey];

      if (!listingMap) {
        listingMap = {};
      }

      let listing = listingMap[lead.listingId];

      if (!listing) {
        listing = 0;
      }
      ++listing;
      listingMap[lead.listingId] = listing;

      groupContactByDate[generateDateKey] = listingMap;
    });

    const report: Record<string, Record<number, ListingWithContactCount>> = {};

    Object.entries(groupContactByDate).forEach(([id, values]) => {
      const listingArray = Object.entries(values)
        .map(([listingId, contactCount]) => {
          return {
            ...this.listingById[Number(listingId)],
            ...{ contactCount },
          };
        })
        .sort((a, b) => b.contactCount - a.contactCount)
        .slice(0, top);

      report[id] = listingArray;
    });

    return report;
  }
}

export const reportManager = new ReportManager();

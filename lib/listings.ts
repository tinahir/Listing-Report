import path from "path";
import fs from "fs";
import * as csv from "fast-csv";
import { Lead, Listing } from "./type";

const getCsvData = (filename: string): Promise<any[]> => {
  const data = new Array<any>();
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(process.cwd(), `public/${filename}`))
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => reject(error))
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => resolve(data));
  });
};

export async function getListing() {
  const listings = await getCsvData("listings.csv");
  const listingIds = new Array<number>();
  const listingById: Record<number, Listing> = {};
  listings.forEach((li) => {
    const car = {
      id: li.id,
      make: li.make as string,
      price: Number(li.price),
      mileage: Number(li.mileage),
      sellerType: li.seller_type as string,
    };
    listingIds.push(car.id);
    listingById[car.id] = car;
  });
  return { listingById, listingIds };
}

export async function getContacts() {
  const contacts = await getCsvData("contacts.csv");
  const contactsIds = new Array<number>();
  const contactsByTime: Record<number, Lead> = {};
  contacts.forEach((li) => {
    const lead: Lead = {
      listingId: Number(li.listing_id),
      contactDate: Number(li.contact_date),
    };
    contactsIds.push(lead.contactDate);
    contactsByTime[lead.contactDate] = lead;
  });
  return { contactsByTime, contactsIds };
}

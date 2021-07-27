import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { EOL } from "os";

const listingHeader = '"id","make","price","mileage","seller_type"';

const contactsHeader = '"listing_id","contact_date"';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const isSave = await saveFile(files.file);
    return isSave
      ? res.status(201).send("")
      : res.status(400).send("Invalid File");
  });
}

const saveFile = async (file: any) => {
  const data = fs.readFileSync(file.path, { encoding: "utf8" });
  const currentHeader = data.substr(0, data.indexOf(EOL));
  if (listingHeader === currentHeader) {
    fs.writeFileSync(`./public/listings.csv`, data);
    await fs.unlinkSync(file.path);
    return Promise.resolve(true);
  }
  if (contactsHeader === currentHeader) {
    fs.writeFileSync(`./public/contacts.csv`, data);
    await fs.unlinkSync(file.path);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

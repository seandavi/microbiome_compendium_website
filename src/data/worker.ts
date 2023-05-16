import { expose } from "comlink";
import { parse } from "papaparse";
import { CSV, Table } from "./";

/**
 * every time you communicate with a web worker, the message content must be
 * serialized/deserialized, which takes a long time with large data. therefore,
 * keep as much computation in this file as possible, and prune data as much as
 * possible before returning.
 */

/** fetch file and parse as csv */
export const parseData = async (url: string): Promise<CSV> => {
  progress?.("Fetching");

  const headers = new Headers();
  headers.set("Accept-Encoding", "gzip, deflate, br");

  const response = await fetch(import.meta.env.BASE_URL + url, { headers });
  if (!response.ok) throw Error("Response not OK");

  progress?.("Parsing text");
  const text = await response.text();

  progress?.("Parsing csv");
  const parsed = await parse(text.trim());
  const data = parsed.data as CSV;

  return data;
};

/** parse csv with "by table" format */
export const parseTable = async (url: string): Promise<Table> => {
  const data = await parseData(url);

  progress?.("Parsing table");

  const table: Table = [];

  for (let col = 1; col < data[0].length; col++) {
    const fullName = String(data[0][col] || "");
    /** get parts from full name */
    const [kingdom = "", phylum = "", _class = ""] = fullName.split(".");
    /** get name from most specific part */
    const name = _class || phylum || kingdom;
    /** skip NA */
    if (name === "NA") continue;

    /** count number of non-zero rows in col */
    let samples = 0;
    for (let row = 1; row < data.length; row++)
      if (data[row][col] !== "0") samples++;

    table.push({ fullName, name, kingdom, phylum, _class, samples });
  }

  /** sort by sample count */
  table.sort((a, b) => b.samples - a.samples);

  return table.slice(0, 15);
};

type OnProgress = (status: string) => void;

/** currently set progress callback */
let progress: OnProgress | undefined;

/** expose method to set progress callback */
export const onProgress = (callback: OnProgress) => (progress = callback);

expose({ parseData, parseTable, onProgress });
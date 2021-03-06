import { Feature, Geometry } from "geojson";
import { EarthquakePropsType } from "../slices/earthquakes.types";
import {
  buildURL,
  getData,
  defaultQueryParams,
  baseURL,
  DEFAULT_PAGE_SIZE,
} from "./earthquakesAPI";

const EarthquakeBoilerplate: Feature<Geometry, EarthquakePropsType> = {
  geometry: {
    coordinates: [],
    type: "Point",
  },
  id: "test-id",
  properties: {
    mag: 20,
    place: "",
    time: 0,
    updated: 40,
    url: "",
    detail: "",
    status: "",
    tsunami: 3,
    sig: -2.3,
    net: "",
    code: "",
    ids: "",
    sources: "",
    types: "",
    nst: 0,
    dmin: 0,
    rms: 0,
    gap: 0,
    magType: "mg",
    title: "",
  },
  type: "Feature",
};

describe("earthquakesAPI", () => {
  describe("buildURL", () => {
    it("must contain the baseURL", () => {
      const url = new URL(buildURL(DEFAULT_PAGE_SIZE));

      expect(url.pathname).toBe(baseURL);
    });

    it("must contain the search Params", () => {
      const url = new URL(buildURL(DEFAULT_PAGE_SIZE));

      const searchParams = Array.from(url.searchParams.keys());

      Object.keys(defaultQueryParams).forEach((key) => {
        expect(searchParams).toContain(key);
      });
    });
  });

  describe("getData", () => {
    const earthquakes = [
      {
        ...EarthquakeBoilerplate,
        properties: {
          ...EarthquakeBoilerplate.properties,
          place: "Atlantic Ocean",
        },
      },
      {
        ...EarthquakeBoilerplate,
        properties: {
          ...EarthquakeBoilerplate.properties,
          place: "Pacific Ocean",
        },
      },
    ];

    beforeEach(() => {
      jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ features: earthquakes }),
        } as Response)
      );
    });

    afterAll(() => {
      jest.spyOn(global, "fetch").mockRestore();
    });

    it("must fetch earthquakes", async () => {
      const data = await getData();

      expect(data).toHaveLength(2);
    });

    it("must fetch earthquakes", async () => {
      const data = await getData();

      expect(data).toStrictEqual(earthquakes);
    });
  });
});

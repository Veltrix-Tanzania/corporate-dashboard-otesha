declare module "@google/earthengine" {
  const ee: {
    data: {
      authenticateViaPrivateKey(
        key: object,
        onSuccess: () => void,
        onError: (err: unknown) => void,
      ): void;
    };
    initialize(
      opt_baseurl: null,
      opt_tileurl: null,
      onSuccess: () => void,
      onError: (err: unknown) => void,
    ): void;
    Geometry: {
      Point(coords: [number, number]): { buffer(meters: number): unknown };
    };
    ImageCollection(id: string): {
      filterBounds(area: unknown): ReturnType<typeof ee.ImageCollection>;
      filterDate(start: string, end: string): ReturnType<typeof ee.ImageCollection>;
      filter(f: unknown): ReturnType<typeof ee.ImageCollection>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map(fn: (img: any) => any): ReturnType<typeof ee.ImageCollection>;
      sort(prop: string): ReturnType<typeof ee.ImageCollection>;
      mosaic(): unknown;
    };
    Image(obj: unknown): {
      normalizedDifference(bands: string[]): ReturnType<typeof ee.Image>;
      rename(name: string): ReturnType<typeof ee.Image>;
      updateMask(mask: unknown): ReturnType<typeof ee.Image>;
      divide(n: number): ReturnType<typeof ee.Image>;
      copyProperties(src: unknown, props: string[]): ReturnType<typeof ee.Image>;
      select(band: string): unknown;
      lt(n: number): unknown;
      getMap(
        vis: object,
        callback: (result: Record<string, unknown>) => void,
      ): void;
      reduceRegion(params: {
        reducer: unknown;
        geometry: unknown;
        scale: number;
        maxPixels?: number;
      }): {
        getInfo(callback: (result: Record<string, number | null>) => void): void;
        evaluate(callback: (result: Record<string, number | null>, err: unknown) => void): void;
      };
    };
    Filter: {
      lt(prop: string, value: number): unknown;
    };
    Reducer: {
      mean(): unknown;
    };
  };
  export default ee;
}

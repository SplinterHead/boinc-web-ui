import { convertBytes } from "@/utils/converters.js";

describe("converters.js", () => {
  describe("convertBytes", () => {
    test.each([
      { inputBytes: 1, outputUnit: "B" },
      { inputBytes: 1000, outputUnit: "KB" },
      { inputBytes: 1000000, outputUnit: "MB" },
      { inputBytes: 1000000000, outputUnit: "GB" },
      { inputBytes: 1000000000000, outputUnit: "TB" },
      { inputBytes: 1000000000000000, outputUnit: "PB" },
    ])("can convert bytes to $outputUnit", ({ inputBytes, outputUnit }) => {
      expect(convertBytes(inputBytes)).toContain(outputUnit);
    });

    it("can round a float to given decimal places", () => {
      const testBytes = 123.4566789;

      // 2 decimal places by default
      expect(convertBytes(testBytes)).toBe("123.46 B");
      expect(convertBytes(testBytes, 1)).toBe("123.5 B");
      expect(convertBytes(testBytes, 0)).toBe("123 B");
    });

    it("can truncate trailing zeros", () => {
      const testBytes = "123.4000";

      expect(convertBytes(testBytes)).toBe("123.4 B");
    });
  });
});

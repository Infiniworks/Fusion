import {afterEach, expect, test, vi} from "vitest";


const exposeInMainWorldMock = vi.fn();
vi.mock("electron", () => ({
  contextBridge: {exposeInMainWorld: exposeInMainWorldMock},
}));


afterEach(() => {
  vi.clearAllMocks();
});


test("index", async () => {
  await import("../src/index");
  expect(exposeInMainWorldMock).toBeCalledTimes(1);
  expect(exposeInMainWorldMock).lastCalledWith("unitTest", 44);
});

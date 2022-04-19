import supertest from "supertest";
import path from "path";
import fs from "fs";
import { app } from "..";
import {
  checkFileExists,
  getImagesDir,
  getResizedImageName,
} from "../utils/util";

const request = supertest(app);

describe("image processing api test suite", () => {
  it("test root api", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    const rootContent: Buffer = fs.readFileSync(
      path.join(__dirname, "..", "index.html")
    );
    expect(response.text).toBe(rootContent.toString());
  });

  it("test empty query", async () => {
    const response = await request.get("/images");
    expect(response.status).toBe(400);
    expect(response.text).toBe('"filename" is required');
  });

  it("test invalid query params", async () => {
    const response = await request.get("/images?file=fjord");
    expect(response.status).toBe(400);
    expect(response.text).toBe('"filename" is required');
  });

  it("test valid filename", async () => {
    const response = await request.get("/images?filename=santamonica");
    expect(response.status).toBe(200);
    expect(
      checkFileExists(
        getImagesDir(__dirname, "full"),
        getResizedImageName("santamonica", undefined, undefined)
      )
    ).toBeTrue();
    expect(
      checkFileExists(
        getImagesDir(__dirname, "thumbs"),
        getResizedImageName("santamonica", undefined, undefined)
      )
    ).toBeFalse();
  });

  it("test invalid filename", async () => {
    const response = await request.get("/images?filename=file");
    expect(response.status).toBe(404);
    expect(response.text).toBe("[Image Not Found]: Image file does not exist");
  });

  it("test width only", async () => {
    const response = await request.get(
      "/images?filename=santamonica&width=500"
    );
    expect(response.status).toBe(200);
    expect(
      checkFileExists(
        getImagesDir(__dirname, "thumbs"),
        getResizedImageName("santamonica", "500", undefined)
      )
    ).toBeTrue();
  });

  it("test height only", async () => {
    const response = await request.get(
      "/images?filename=santamonica&height=700"
    );
    expect(response.status).toBe(200);
    expect(
      checkFileExists(
        getImagesDir(__dirname, "thumbs"),
        getResizedImageName("santamonica", undefined, "700")
      )
    ).toBeTrue();
  });

  it("test width & height", async () => {
    const response = await request.get(
      "/images?filename=fjord&width=800&height=800"
    );
    expect(response.status).toBe(200);
    expect(
      checkFileExists(
        getImagesDir(__dirname, "thumbs"),
        getResizedImageName("fjord", "800", "800")
      )
    ).toBeTrue();
  });

  it("test invalid width", async () => {
    const response = await request.get(
      "/images?filename=santamonica&width=gvh"
    );
    expect(response.status).toBe(400);
    expect(response.text).toBe('"width" must be a number');
  });

  it("test invalid height", async () => {
    const response = await request.get(
      "/images?filename=santamonica&height=wreg"
    );
    expect(response.status).toBe(400);
    expect(response.text).toBe('"height" must be a number');
  });
});

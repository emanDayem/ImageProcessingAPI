import supertest from "supertest";
import path from "path";
import fs from "fs";
import { app } from "..";
import {
  checkFileExists,
  getImagesDir,
  getImagePath,
  createDirIfNotExists,
} from "../utils";

import { resize } from "../utils/imageProcessing";

const request = supertest(app);

describe("app test", () => {
  beforeAll(() =>
    fs.rmSync(getImagesDir(__dirname, "thumbs"), {
      recursive: true,
      force: true,
    })
  );

  describe("apis test", () => {
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
          getImagePath(
            getImagesDir(__dirname, "full"),
            "santamonica",
            undefined,
            undefined
          )
        )
      ).toBeTrue();
      expect(
        checkFileExists(
          getImagePath(
            getImagesDir(__dirname, "thumbs"),
            "santamonica",
            undefined,
            undefined
          )
        )
      ).toBeFalse();
    });

    it("test invalid filename", async () => {
      const response = await request.get("/images?filename=file");
      expect(response.status).toBe(404);
      expect(response.text).toBe(
        "[Image Not Found]: Image file does not exist"
      );
    });

    it("test width only", async () => {
      const response = await request.get(
        "/images?filename=santamonica&width=500"
      );
      expect(response.status).toBe(200);
      expect(
        checkFileExists(
          getImagePath(
            getImagesDir(__dirname, "thumbs"),
            "santamonica",
            "500",
            undefined
          )
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
          getImagePath(
            getImagesDir(__dirname, "thumbs"),
            "santamonica",
            undefined,
            "700"
          )
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
          getImagePath(getImagesDir(__dirname, "thumbs"), "fjord", "800", "800")
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

    it("test negative width", async () => {
      const response = await request.get(
        "/images?filename=santamonica&width=-100"
      );
      expect(response.status).toBe(400);
      expect(response.text).toBe('"width" must be greater than 0');
    });

    it("test negative height", async () => {
      const response = await request.get(
        "/images?filename=santamonica&height=-900"
      );
      expect(response.status).toBe(400);
      expect(response.text).toBe('"height" must be greater than 0');
    });

    it("test zero width", async () => {
      const response = await request.get(
        "/images?filename=santamonica&width=0"
      );
      expect(response.status).toBe(400);
      expect(response.text).toBe('"width" must be greater than 0');
    });

    it("test zero height", async () => {
      const response = await request.get(
        "/images?filename=santamonica&height=0"
      );
      expect(response.status).toBe(400);
      expect(response.text).toBe('"height" must be greater than 0');
    });
  });

  describe("image processing test", () => {
    it("test resize with valid width and valid height", async () => {
      const inputImagePath = path.join(
        getImagesDir(__dirname, "full"),
        "fjord.jpg"
      );
      const outputImagePath = path.join(
        getImagesDir(__dirname, "thumbs"),
        "fjord_test1.jpg"
      );
      expect(async () => {
        await resize(inputImagePath, outputImagePath, 800, 800).then(() =>
          expect(
            checkFileExists(
              getImagePath(
                getImagesDir(__dirname, "thumbs"),
                "fjord_test1",
                undefined,
                undefined
              )
            )
          ).toBeTrue()
        );
      }).not.toThrow();
    });

    it("test resize with undefined width and undefined height", async () => {
      const inputImagePath = path.join(
        getImagesDir(__dirname, "full"),
        "fjord.jpg"
      );
      const outputImagePath = path.join(
        getImagesDir(__dirname, "thumbs"),
        "fjord_test2.jpg"
      );
      expect(async () => {
        await resize(
          inputImagePath,
          outputImagePath,
          undefined,
          undefined
        ).then(() => {
          expect(
            checkFileExists(
              getImagePath(
                getImagesDir(__dirname, "full"),
                "fjord",
                undefined,
                undefined
              )
            )
          ).toBeTrue();
          expect(
            checkFileExists(
              getImagePath(
                getImagesDir(__dirname, "thumbs"),
                "fjord_test2",
                undefined,
                undefined
              )
            )
          ).toBeFalse();
        });
      }).not.toThrow();
    });

    it("test resize with width only", async () => {
      const inputImagePath = path.join(
        getImagesDir(__dirname, "full"),
        "fjord.jpg"
      );
      const outputImagePath = getImagePath(
        getImagesDir(__dirname, "thumbs"),
        "fjord_test3",
        "500",
        undefined
      );
      expect(async () => {
        await resize(inputImagePath, outputImagePath, 500, undefined).then(() =>
          expect(
            checkFileExists(
              getImagePath(
                getImagesDir(__dirname, "thumbs"),
                "fjord_test3",
                "500",
                undefined
              )
            )
          ).toBeTrue()
        );
      }).not.toThrow();
    });

    it("test resize with height only", async () => {
      const inputImagePath = path.join(
        getImagesDir(__dirname, "full"),
        "fjord.jpg"
      );
      const outputImagePath = getImagePath(
        getImagesDir(__dirname, "thumbs"),
        "fjord_test4",
        undefined,
        "600"
      );
      expect(async () => {
        await resize(inputImagePath, outputImagePath, undefined, 600).then(() =>
          expect(
            checkFileExists(
              getImagePath(
                getImagesDir(__dirname, "thumbs"),
                "fjord_test4",
                undefined,
                "600"
              )
            )
          ).toBeTrue()
        );
      }).not.toThrow();
    });
  });

  describe("utils test", () => {
    it("test checkFileExists with wrong path", async () => {
      const fakePath = path.join(getImagesDir(__dirname, "full"), "fakepath");
      expect(checkFileExists(fakePath)).toBeFalse();
    });

    it("test checkFileExists with correct path", async () => {
      const correctPath = path.join(
        getImagesDir(__dirname, "full"),
        "fjord.jpg"
      );
      expect(checkFileExists(correctPath)).toBeTrue();
    });

    it("test getImagePath with width and height", async () => {
      const actualOutput = getImagePath("E:/Folder", "file", "300", "500");
      const expectedOutput = path.join("E:", "Folder", "file_w300_h500.jpg");
      expect(actualOutput).toBe(expectedOutput);
    });

    it("test getImagePath with width only", async () => {
      const actualOutput = getImagePath("E:/Folder", "file", "300", undefined);
      const expectedOutput = path.join("E:", "Folder", "file_w300.jpg");
      expect(actualOutput).toBe(expectedOutput);
    });

    it("test getImagePath with height only", async () => {
      const actualOutput = getImagePath("E:/Folder", "file", undefined, "300");
      const expectedOutput = path.join("E:", "Folder", "file_h300.jpg");
      expect(actualOutput).toBe(expectedOutput);
    });

    it("test getImagePath with undefined width and height", async () => {
      const actualOutput = getImagePath(
        "E:/Folder",
        "file",
        undefined,
        undefined
      );
      const expectedOutput = path.join("E:", "Folder", "file.jpg");
      expect(actualOutput).toBe(expectedOutput);
    });

    it("test createDirIfNotExists when the directory not exists", async () => {
      const testfolder = path.join(
        getImagesDir(__dirname, "thumbs"),
        "testfolder"
      );
      expect(fs.existsSync(testfolder)).toBeFalse();

      createDirIfNotExists(testfolder);
      expect(fs.existsSync(testfolder)).toBeTrue();
    });

    it("test createDirIfNotExists when the directory exists", async () => {
      const testfolder = path.join(
        getImagesDir(__dirname, "thumbs"),
        "testfolder"
      );
      createDirIfNotExists(testfolder);
      expect(fs.existsSync(testfolder)).toBeTrue();

      fs.rmdirSync(testfolder);
      expect(fs.existsSync(testfolder)).toBeFalse();
    });
  });
});

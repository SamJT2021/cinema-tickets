import { expect } from "chai";

import ResourceNotFoundError from "../../../src/pairtest/lib/errors/ResourceNotFoundError.js";

describe("ResourceNotFoundError", () => {
  context("constructor", () => {
    it("should return passed url", () => {
      expect(new ResourceNotFoundError("/foo/bar", "POST").url).to.be.eql(
        "/foo/bar",
      );
    });

    it("should return passed method", () => {
      expect(new ResourceNotFoundError("/foo/bar", "POST").method).to.be.eql(
        "POST",
      );
    });

    it("should return default message", () => {
      expect(new ResourceNotFoundError("/foo/bar", "POST").message).to.be.eql(
        "Resource Not Found",
      );
    });

    it("should return passed message", () => {
      expect(
        new ResourceNotFoundError("/foo/bar", "POST", "test").message,
      ).to.be.eql("test");
    });

    it("should return code", () => {
      expect(new ResourceNotFoundError("/foo/bar", "POST").code).to.be.eql(404);
    });

    it("should return name", () => {
      expect(new ResourceNotFoundError("/foo/bar", "POST").name).to.be.eql(
        "ResourceNotFoundError",
      );
    });
  });
});

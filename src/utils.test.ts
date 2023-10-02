import path from "node:path";
import { describe, expect, test } from "vitest";
import {
	checkWorkingDirectory,
	detectPackageManager,
	isValidPackageManager,
	semverCompare,
} from "./utils";

describe("semverCompare", () => {
	test("should return false if the second argument is equal to the first argument", () => {
		const isVersion1LessThanVersion2 = semverCompare("1.2.3", "1.2.3");

		expect(isVersion1LessThanVersion2).toBe(false);
	});

	test("should return true if the first argument is less than the second argument", () => {
		const isVersion1LessThanVersion2 = semverCompare("1.2.2", "1.2.3");

		expect(isVersion1LessThanVersion2).toBe(true);
	});
});

describe("checkWorkingDirectory", () => {
	test("should return the normalized path if the directory exists", () => {
		const normalizedPath = checkWorkingDirectory(".");
		expect(normalizedPath).toBe(path.normalize("."));
	});

	test("should fail if the directory does not exist", () => {
		expect(() =>
			checkWorkingDirectory("/does/not/exist"),
		).toThrowErrorMatchingInlineSnapshot(
			'"Directory /does/not/exist does not exist."',
		);
	});
});

describe("detectPackageManager", () => {
	test("should return name of package manager for current workspace", () => {
		expect(detectPackageManager()).toBe("npm");
	});

	test("should return npm if package-lock.json exists", () => {
		expect(detectPackageManager("test/npm")).toBe("npm");
	});

	test("should return yarn if yarn.lock exists", () => {
		expect(detectPackageManager("test/yarn")).toBe("yarn");
	});

	test("should return pnpm if pnpm-lock.yaml exists", () => {
		expect(detectPackageManager("test/pnpm")).toBe("pnpm");
	});

	test("should return null if no package manager is detected", () => {
		expect(detectPackageManager("test/empty")).toBe(null);
	});
});

test("isValidPackageManager", () => {
	expect(isValidPackageManager("npm")).toBe(true);
	expect(isValidPackageManager("pnpm")).toBe(true);
	expect(isValidPackageManager("yarn")).toBe(true);

	expect(isValidPackageManager("")).toBe(false);
	expect(isValidPackageManager("ppnpm")).toBe(false);
});
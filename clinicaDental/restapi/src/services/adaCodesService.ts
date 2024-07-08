import path from "path";
import fs from "fs";
import { parse } from "csv-parse";

export class ADACodesService {
  private static loaded: boolean = false;

  private static codes: Map<string, string> = new Map<string, string>();

  public static async getAdaCode(code: string): Promise<string> {
    if (!this.loaded) {
      await this.loadCodes();
    }

    while (this.codes.size === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    let codeAda = this.codes.get(code);
    if (!codeAda) {
      throw new Error("Code not found");
    }
    return codeAda;
  }

  private static async loadCodes() {
    await this.parse(["code", "codeAda"], "adaCodes.csv", (element: any) => {
      this.codes.set(element.code, element.codeAda);
    });
    this.loaded = true;
  }

  private static async parse(headers: string[], file: string, func: any) {
    let csvFilePath = path.resolve(__dirname, "..", "resources", file);
    const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });
    parse(
      fileContent,
      {
        delimiter: ";",
        columns: headers,
      },
      (error, result: any[]) => {
        if (error) {
          console.error(error);
        } else {
          result.forEach((element) => {
            func(element);
          });
        }
      }
    );
  }
}

import path from "path";
import fs from "fs";
import { parse } from "csv-parse";

export class SnomedCodesService {
  private static loadedTeeth: boolean = false;
  private static teethCodes: Map<string, string> = new Map<string, string>();

  private static loadedProcedures: boolean = false;
  private static proceduresCodes: Map<string, string> = new Map<
    string,
    string
  >();

  public static async getToothCode(code: string): Promise<string> {
    if (!this.loadedTeeth) {
      await this.loadTeethCodes();
    }

    while (this.teethCodes.size === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    let teethCode = this.teethCodes.get(code);
    if (!teethCode) {
      throw new Error("Code not found");
    }
    return teethCode;
  }

  public static async getProcedureCode(code: string): Promise<string> {
    if (!this.loadedProcedures) {
      await this.loadProcedureCodes();
    }

    while (this.proceduresCodes.size === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    let procedureCode = this.proceduresCodes.get(code);
    if (!procedureCode) {
      throw new Error("Code not found");
    }
    return procedureCode;
  }

  private static async loadTeethCodes() {
    await this.parse(
      ["code", "codeSnomed"],
      "snomedTeethCodes.csv",
      (element: any) => {
        this.teethCodes.set(element.code, element.codeSnomed);
      }
    );
    this.loadedTeeth = true;
  }

  private static async loadProcedureCodes() {
    await this.parse(
      ["code", "codeSnomed"],
      "snomedProceduresCodes.csv",
      (element: any) => {
        this.proceduresCodes.set(element.code, element.codeSnomed);
      }
    );
    this.loadedProcedures = true;
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

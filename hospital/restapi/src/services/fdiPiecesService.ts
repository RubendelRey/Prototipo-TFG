export class FDIPiecesService {
  public static getFDIPiecesName(code: string): string {
    let zone = Number(code.substring(0, 1));

    if (zone <= 4) {
      return this.getPieces(code, this.getPermanentNames(), "permanente");
    }
    return this.getPieces(code, this.getTemporaryNames(), "temporal");
  }

  private static getPieces(
    code: string,
    piecesNames: string[],
    piecesType: string
  ): string {
    let zone = Number(code.substring(0, 1));
    let position = Number(code.substring(1, 2));

    let piecesName = piecesNames[position - 1];
    let aux = zone % 4;
    aux = aux === 0 ? 4 : aux;
    let location = this.locations[aux - 1];

    return `${piecesName} ${location} ${piecesType}`;
  }

  private static getPermanentNames(): string[] {
    return [
      "Incisivo central",
      "Incisivo lateral",
      "Canino",
      "Primer premolar",
      "Segundo premolar",
      "Primer molar",
      "Segundo molar",
      "Tercer molar",
    ];
  }

  private static getTemporaryNames(): string[] {
    return [
      "Incisivo central",
      "Incisivo lateral",
      "Canino",
      "Primer molar",
      "Segundo molar",
    ];
  }

  private static locations: string[] = [
    "superior derecho",
    "superior izquierdo",
    "inferior izquierdo",
    "inferior derecho",
  ];
}

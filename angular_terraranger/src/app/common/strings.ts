export enum MessungBtn {
  START = "Messung starten",
  RESET = "Neustarten"
}

export class Messung {
  public static INTRODUCTION = "Hallo! An dieser Teststation kannst du deine aktuelle Gesichtstemperatur messen."
  public static INSTRUCTIONS = `Bitte positioniere deine <b>Stirn- und Augenpartie innerhalb des schwarzen Kastens</b>. Achte auf einen <b>Abstand von ca. 30cm zum Sensor</b>. Wenn du bereit bist, klicke auf den Button "${MessungBtn.START}".`;
  public static START = `Die Messung wird gestartet, bitte halte <b>5 Sekunden</b> lang still, bis sie getätigt wurde.`;

  public static ERGEBNIS(ergebnis: string) {
    return `Deine Gesichtstemperatur beträgt momentan <b>${ergebnis}°C</b>.`
  }
}

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

type InsulationType = "oppen" | "slutet0_45" | "slutet45_90";

const priceData: Record<InsulationType, Record<number, number>> = {
  "oppen": {
    200: 156,
    250: 187.5,
    300: 225,
    350: 262.5,
    400: 240,
    450: 270,
    500: 300,
    550: 330,
    600: 360,
    650: 390,
    700: 420,
    750: 450,
    800: 480
  },
  "slutet0_45": {
    200: 200.2,
    220: 211.75,
    250: 240.63,
    300: 288.75,
    350: 336.88,
    400: 385,
    450: 433.13,
    500: 481.25,
    550: 529.38,
    600: 577.5,
    650: 625.63,
    700: 673.75,
    750: 721.88,
    800: 770
  },
  "slutet45_90": {
    70: 86.24,
    95: 117.04,
    120: 147.84,
    145: 159.5,
    170: 187,
    195: 214.5,
    200: 220,
    220: 242,
    250: 275,
    300: 330,
    350: 385,
    400: 440,
    450: 495,
    500: 550,
    550: 605,
    600: 660,
    650: 715,
    700: 770,
    750: 825,
    800: 880
  }
};

const defaultThicknessMap: Record<InsulationType, number> = {
  oppen: 200,
  slutet0_45: 200,
  slutet45_90: 70
};

export default function BerakningsFormular() {
  const [rows, setRows] = useState([
    { insulationType: "oppen" as InsulationType, thickness: 200, area: 0 }
  ]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [result, setResult] = useState<null | {
    bruttopris: number;
    rabatt: number;
    totaltExklMoms: number;
    totaltInklMoms: number;
  }>(null);

  const addRow = () => {
    const insulationType: InsulationType = "oppen";
    setRows([...rows, { insulationType, thickness: defaultThicknessMap[insulationType], area: 0 }]);
  };

  const removeRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const updateRow = (index: number, field: string, value: number | string) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: field === "area" || field === "thickness" ? Number(value) : value
            }
          : row
      )
    );
  };

  const getPrice = (type: InsulationType, thickness: number): number => {
    return priceData[type]?.[thickness] || 0;
  };

  const calculate = () => {
    let bruttopris = 0;

    rows.forEach(row => {
      const price = getPrice(row.insulationType, row.thickness);
      bruttopris += row.area * price;
    });

    const rabatt = bruttopris * (discountPercent / 100);
    const totaltExklMoms = bruttopris - rabatt;
    const totaltInklMoms = totaltExklMoms * 1.25;

    setResult({ bruttopris, rabatt, totaltExklMoms, totaltInklMoms });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold">Beräkningsformulär för Lösullsisolering</h2>

          {rows.map((row, index) => {
            const pricePerM2 = getPrice(row.insulationType, row.thickness);
            const isValid = pricePerM2 > 0;
            const delpris = row.area * pricePerM2;

            return (
              <div key={index} className="border p-4 rounded-lg space-y-2 relative">
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 text-red-500"
                  onClick={() => removeRow(index)}
                >
                  Ta bort
                </Button>
                <div>
                  <Label>Typ av isolering</Label>
                  <Select
                    onValueChange={(val) => {
                      updateRow(index, "insulationType", val);
                      updateRow(index, "thickness", defaultThicknessMap[val as InsulationType]);
                    }}
                    value={row.insulationType}
                  >
                    <SelectTrigger>
                      <span>
                        {row.insulationType === "oppen"
                          ? "Hunton Öppet Bjälklag"
                          : row.insulationType === "slutet0_45"
                          ? "Hunton Slutet 0–45°"
                          : "Hunton Slutet 45–90°"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oppen">Hunton Öppet Bjälklag</SelectItem>
                      <SelectItem value="slutet0_45">Hunton Slutet 0–45°</SelectItem>
                      <SelectItem value="slutet45_90">Hunton Slutet 45–90°</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Area (m²)</Label>
                  <Input
                    type="number"
                    value={row.area}
                    onChange={(e) => updateRow(index, "area", e.target.value)}
                    placeholder="Ex: 120"
                  />
                </div>

                <div>
                  <Label>Tjocklek (mm)</Label>
                  <Select
                    onValueChange={(val) => updateRow(index, "thickness", val)}
                    value={String(row.thickness ?? "")}
                  >
                    <SelectTrigger>
                      <span>{row.thickness} mm</span>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(priceData[row.insulationType] || {}).map((t) => (
                        <SelectItem key={t} value={t}>{t} mm</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p><strong>Pris per m²:</strong> {pricePerM2.toFixed(2)} kr</p>
                {!isValid ? (
                  <p className="text-red-500 font-semibold">Tjocklek saknar pris i listan</p>
                ) : (
                  <p><strong>Delpris:</strong> {delpris.toFixed(2)} kr</p>
                )}
              </div>
            );
          })}

          <Button variant="outline" onClick={addRow}>+ Lägg till yta</Button>

          <div>
            <Label>Rabatt (%)</Label>
            <Input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              placeholder="Ex: 5"
            />
          </div>

          <Button onClick={calculate} className="w-full">Beräkna Pris</Button>

          {result && (
            <div className="mt-6 space-y-2">
              <h3 className="text-xl font-semibold">Resultat:</h3>
              <p><strong>Bruttopris:</strong> {result.bruttopris.toFixed(2)} kr</p>
              <p><strong>Rabatt:</strong> -{result.rabatt.toFixed(2)} kr</p>
              <p><strong>Totalt exkl. moms:</strong> {result.totaltExklMoms.toFixed(2)} kr</p>
              <p><strong>Totalt inkl. moms:</strong> {result.totaltInklMoms.toFixed(2)} kr</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

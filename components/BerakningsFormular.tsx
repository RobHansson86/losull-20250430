import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import {
  insulationData,
  Brand,
  InsulationType,
  getTypeLabel
} from "@/lib/insulationData";

type Row = {
  brand: Brand;
  insulationType: InsulationType;
  thickness: number;
  area: number;
};

const defaultBrand: Brand = "Hunton";

const getDefaultType = (brand: Brand): InsulationType =>
  Object.keys(insulationData[brand].types)[0] as InsulationType;

const getDefaultThickness = (brand: Brand, type: InsulationType): number =>
  insulationData[brand].types[type]?.defaultThickness || 0;

export default function BerakningsFormular() {
  const initialType = getDefaultType(defaultBrand);
  const [rows, setRows] = useState<Row[]>([
    {
      brand: defaultBrand,
      insulationType: initialType,
      thickness: getDefaultThickness(defaultBrand, initialType),
      area: 0,
    },
  ]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [result, setResult] = useState<
    | null
    | {
        bruttopris: number;
        rabatt: number;
        totaltExklMoms: number;
        totaltInklMoms: number;
        totalVolume: number;
        totalWeight: number;
      }
  >(null);

  const addRow = () => {
    const brand = defaultBrand;
    const type = getDefaultType(brand);
    setRows([
      ...rows,
      {
        brand,
        insulationType: type,
        thickness: getDefaultThickness(brand, type),
        area: 0,
      },
    ]);
  };

  const removeRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const updateRow = (
    index: number,
    field: keyof Row,
    value: number | string
  ) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: field === "area" || field === "thickness" ? Number(value) : value,
            }
          : row
      )
    );
  };

  const getPrice = (
    brand: Brand,
    type: InsulationType,
    thickness: number
  ): number => {
    return (
      insulationData[brand]?.types[type]?.thicknessPrices[thickness] || 0
    );
  };

  const calculate = () => {
    let bruttopris = 0;
    let totalVolume = 0;
    let totalWeight = 0;

    rows.forEach((row) => {
      const price = getPrice(row.brand, row.insulationType, row.thickness);
      bruttopris += row.area * price;
      const volume = row.area * (row.thickness / 1000);
      totalVolume += volume;
      const density = insulationData[row.brand].density;
      totalWeight += volume * density;
    });

    const rabatt = bruttopris * (discountPercent / 100);
    const totaltExklMoms = bruttopris - rabatt;
    const totaltInklMoms = totaltExklMoms * 1.25;

    setResult({
      bruttopris,
      rabatt,
      totaltExklMoms,
      totaltInklMoms,
      totalVolume,
      totalWeight,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold">Beräkningsformulär för Lösullsisolering</h2>

          {rows.map((row, index) => {
            const pricePerM2 = getPrice(
              row.brand,
              row.insulationType,
              row.thickness
            );
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
                  <Label>Varumärke</Label>
                  <Select
                    onValueChange={(val) => {
                      const brand = val as Brand;
                      const type = getDefaultType(brand);
                      updateRow(index, "brand", brand);
                      updateRow(index, "insulationType", type);
                      updateRow(
                        index,
                        "thickness",
                        getDefaultThickness(brand, type)
                      );
                    }}
                    value={row.brand}
                  >
                    <SelectTrigger>
                      <span>{row.brand}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(insulationData).map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Typ av isolering</Label>
                  <Select
                    onValueChange={(val) => {
                      const type = val as InsulationType;
                      updateRow(index, "insulationType", type);
                      updateRow(
                        index,
                        "thickness",
                        getDefaultThickness(row.brand, type)
                      );
                    }}
                    value={row.insulationType}
                  >
                    <SelectTrigger>
                      <span>{getTypeLabel(row.brand, row.insulationType)}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(insulationData[row.brand].types).map((t) => (
                        <SelectItem key={t} value={t}>
                          {getTypeLabel(row.brand, t as InsulationType)}
                        </SelectItem>
                      ))}
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
                    value={String(row.thickness)}
                  >
                    <SelectTrigger>
                      <span>{row.thickness} mm</span>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(
                        insulationData[row.brand].types[
                          row.insulationType
                        ]?.thicknessPrices || {}
                      ).map((t) => (
                        <SelectItem key={t} value={t}>
                          {t} mm
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p>
                  <strong>Pris per m²:</strong> {pricePerM2.toFixed(2)} kr
                </p>
                {!isValid ? (
                  <p className="text-red-500 font-semibold">
                    Tjocklek saknar pris i listan
                  </p>
                ) : (
                  <p>
                    <strong>Delpris:</strong> {delpris.toFixed(2)} kr
                  </p>
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
              <p><strong>Total volym:</strong> {result.totalVolume.toFixed(2)} m³</p>
              <p><strong>Total vikt:</strong> {result.totalWeight.toFixed(2)} kg</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


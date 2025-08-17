export default async function ViewerPage({ params }: { params: Promise<{ sheetId: string }> }) {
  const { sheetId } = await params;
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Viewer {sheetId}</h1>
      <p>PDF-visning implementeras i senare steg.</p>
    </main>
  );
}

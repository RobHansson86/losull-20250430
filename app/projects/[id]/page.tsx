export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Projekt {id}</h1>
      <p>Detaljsida för projektet.</p>
    </main>
  );
}

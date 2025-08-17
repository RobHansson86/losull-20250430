import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Ritningsmätning</h1>
      <p>
        Fortsätt till <Link href="/login" className="underline text-blue-600">inloggning</Link> eller
        {" "}
        <Link href="/projects" className="underline text-blue-600">projektlistan</Link>.
      </p>
    </main>
  );
}

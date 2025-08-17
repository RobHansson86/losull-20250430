"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
}

export default function ProjectsPage() {
  const supabase = createSupabaseClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("projects")
      .select("id, name")
      .order("created_at");
    setProjects(data ?? []);
  }

  async function addProject() {
    if (!name) return;
    await supabase.from("projects").insert({ name });
    setName("");
    load();
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Projekt</h1>
      <div className="flex space-x-2">
        <Input
          placeholder="Nytt projekt"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={addProject}>Lägg till</Button>
      </div>
      <ul className="list-disc pl-6">
        {projects.map((p) => (
          <li key={p.id}>
            <a href={`/projects/${p.id}`}>{p.name}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}

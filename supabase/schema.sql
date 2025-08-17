create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client text,
  created_by uuid references auth.users not null,
  created_at timestamptz default now()
);

create table drawings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects not null,
  file_path text not null,
  filename text not null,
  page_count integer,
  uploaded_by uuid references auth.users,
  uploaded_at timestamptz default now()
);

create table sheets (
  id uuid primary key default gen_random_uuid(),
  drawing_id uuid references drawings not null,
  page_index integer not null,
  title text,
  mm_per_px numeric,
  scale_text text,
  calibrated_by uuid references auth.users,
  calibrated_at timestamptz
);

create table layers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects not null,
  name text not null,
  color text,
  description text,
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

create table measurements (
  id uuid primary key default gen_random_uuid(),
  sheet_id uuid references sheets not null,
  layer_id uuid references layers,
  type text check (type in ('length','area','count')) not null,
  geometry jsonb,
  length_m numeric,
  area_m2 numeric,
  perimeter_m numeric,
  count integer,
  notes text,
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

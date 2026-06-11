-- Users table for authentication with simple username/password
create table users (
    id uuid primary key default gen_random_uuid(),
    username text unique not null,
    password text not null,
    created_at timestamp default now()
);

-- Enable RLS (Row Level Security)
alter table users enable row level security;

-- Create policy to allow anonymous users to read users table for login
create policy "Allow public read access for login"
on users for select
using (true);

-- Create policy to allow anonymous users to insert new users for registration
create policy "Allow public insert for registration"
on users for insert
with check (true);

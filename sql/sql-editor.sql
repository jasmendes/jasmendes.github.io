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

insert into users (username, password)
 values ( 'admin','1234');

 select * from users;

 alter table users enable row level security;
alter table scores enable row level security;

create policy "public users select"
on users
for select
using (true);

create policy "public users insert"
on users
for insert
with check (true);

create policy "public scores select"
on scores
for select
using (true);

create policy "public scores insert"
on scores
for insert
with check (true);


select * from users;

insert into scores ( username ,subject, difficulty, score, total_questions)
 values ( 'toto','Matemática 6 ano' ,'easy',17,10);

-- Function to insert new user
create or replace function insert_user(p_username text, p_password text)
returns table (id uuid, username text, created_at timestamp) as $$
begin
  return query
  insert into users (username, password)
  values (p_username, p_password)
  returning users.id, users.username, users.created_at;
end;
$$ language plpgsql;

-- Function to insert new score
create or replace function insert_score(
  p_username text,
  p_subject text,
  p_difficulty text,
  p_score integer,
  p_total_questions integer default 10
)
returns table (id uuid, username text, subject text, difficulty text, score integer, created_at timestamp) as $$
begin
  return query
  insert into scores (username, subject, difficulty, score, total_questions)
  values (p_username, p_subject, p_difficulty, p_score, p_total_questions)
  returning scores.id, scores.username, scores.subject, scores.difficulty, scores.score, scores.created_at;
end;
$$ language plpgsql;
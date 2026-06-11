create table scores (
    id bigint generated always as identity primary key,

    user_id uuid references auth.users(id),

    username text not null,

    subject text not null,

    difficulty text not null,

    score integer not null,

    total_questions integer not null,

    created_at timestamp default now()
);



create table profiles (

    id uuid primary key
    references auth.users(id)
    on delete cascade,

    username text unique not null,

    full_name text,

    turma text,

    role text default 'student',

    created_at timestamp default now()
);
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
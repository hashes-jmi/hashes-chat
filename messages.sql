create table messages (
    id serial primary key,
    body varchar,
    sender varchar,
    created_at timestamp without time zone default (now() at time zone 'utc')
);
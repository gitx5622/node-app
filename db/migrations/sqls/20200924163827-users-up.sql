-- +migrate Up
CREATE TABLE users (
   id            BIGSERIAL PRIMARY KEY,
   first_name    varchar(100) NOT NULL DEFAULT '',
   last_name     varchar(100) NOT NULL DEFAULT '',
   username      varchar(15),
   email         varchar(50)  NOT NULL,
   password_hash varchar(255) NOT NULL,
   created_at    TIMESTAMPTZ  NOT NULL DEFAULT clock_timestamp(),
   updated_at    TIMESTAMPTZ  NOT NULL DEFAULT clock_timestamp()
);

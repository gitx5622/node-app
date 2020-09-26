-- +migrate Up
CREATE TABLE users (
   id            BIGSERIAL PRIMARY KEY,
   name          varchar(255) NOT NULL,
   email         varchar(255) NOT NULL,
   password      varchar(1024) NOT NULL,
   created_at    TIMESTAMPTZ  NOT NULL DEFAULT clock_timestamp(),
   updated_at    TIMESTAMPTZ  NOT NULL DEFAULT clock_timestamp()
);
CREATE UNIQUE INDEX users_email_uniq_idx ON users(LOWER(email));
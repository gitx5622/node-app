-- +migrate Up
CREATE TABLE courses (
     id            BIGSERIAL PRIMARY KEY,
     name          varchar(255) NOT NULL DEFAULT '',
     created_at    TIMESTAMPTZ  NOT NULL DEFAULT clock_timestamp(),
     updated_at    TIMESTAMPTZ  NOT NULL DEFAULT clock_timestamp()
);

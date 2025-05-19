CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.storycards (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content    TEXT        NOT NULL,
  pos_x      DOUBLE PRECISION NOT NULL,
  pos_y      DOUBLE PRECISION NOT NULL,
  height     INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMP   NOT NULL DEFAULT now(),
  board_id   TEXT        NOT NULL
);
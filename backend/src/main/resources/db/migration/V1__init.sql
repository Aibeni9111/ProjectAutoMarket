
CREATE TABLE IF NOT EXISTS car (
                                 id           BIGSERIAL PRIMARY KEY,
                                 make         VARCHAR(64)  NOT NULL,
  model        VARCHAR(64)  NOT NULL,
  year         INTEGER      NOT NULL CHECK (year BETWEEN 1950 AND EXTRACT(YEAR FROM NOW())::int + 1),
  price_eur    INTEGER      NOT NULL CHECK (price_eur >= 0),
  image_url    TEXT         NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
  );

CREATE INDEX IF NOT EXISTS idx_car_make ON car (make);
CREATE INDEX IF NOT EXISTS idx_car_model ON car (model);
CREATE INDEX IF NOT EXISTS idx_car_year ON car (year);
CREATE INDEX IF NOT EXISTS idx_car_price ON car (price_eur);

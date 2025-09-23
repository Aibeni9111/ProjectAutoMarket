ALTER TABLE car ADD COLUMN IF NOT EXISTS seller_uid varchar(64);


CREATE INDEX IF NOT EXISTS idx_car_seller_uid ON car (seller_uid);

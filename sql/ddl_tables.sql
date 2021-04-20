
--                    _
--     _ __ ___   ___| |_ __ _
--    | '_ ` _ \ / _ \ __/ _` |
--    | | | | | |  __/ || (_| |
--    |_| |_| |_|\___|\__\__,_|

-- DROP TABLE province;
CREATE TABLE province (
	id INTEGER NOT NULL,
	"name" VARCHAR(45) NULL,
	CONSTRAINT province_pkey PRIMARY KEY (id)
);

-- DROP TABLE district;
CREATE TABLE district (
	id INTEGER NOT NULL,
	province_id INTEGER NULL,
	"name" VARCHAR(45) NULL,
	CONSTRAINT district_pkey PRIMARY KEY (id),
	CONSTRAINT district_province_id_foreign FOREIGN KEY (province_id) REFERENCES province(id)
);

-- DROP TABLE city;
CREATE TABLE city (
	id INTEGER NOT NULL,
	district_id INTEGER NULL,
	"name" VARCHAR(45) NULL,
	CONSTRAINT city_pkey PRIMARY KEY (id),
	CONSTRAINT city_district_id_foreign FOREIGN KEY (district_id) REFERENCES district(id)
);


--DROP MATERIALIZED VIEW district_cities;
--REFRESH MATERIALIZED VIEW district_cities;
CREATE MATERIALIZED VIEW district_cities AS
	SELECT d.name, d.province_id, jsonb_agg(c.name) AS cities
		FROM district d
		JOIN city c ON c.district_id = d.id
			GROUP BY d.id;

--DROP MATERIALIZED VIEW province_districts_cities;
--REFRESH MATERIALIZED VIEW province_districts_cities;
CREATE MATERIALIZED VIEW province_districts_cities AS
	SELECT p.name, jsonb_agg(json_build_object('name', dc.name, 'cities', dc.cities)) AS districts
		FROM province p
		JOIN district_cities dc ON dc.province_id = p.id
			GROUP BY p.id;


-- -----------------------------------------------------------------------------------------------------------------
--                                     _
--      __ _  ___ ___ ___  _   _ _ __ | |_
--     / _` |/ __/ __/ _ \| | | | '_ \| __|
--    | (_| | (_| (_| (_) | |_| | | | | |_
--     \__,_|\___\___\___/ \__,_|_| |_|\__|

-- DROP TABLE account_type;
CREATE TABLE account_type (
	"type" VARCHAR(50) NOT NULL,
	PRIMARY KEY (type)
);

-- DROP TABLE user_data;
CREATE TABLE user_data (
	user_id UUID NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50)  NOT NULL,
	email VARCHAR(100)  NOT NULL,
	telephone VARCHAR(15),
	avatar VARCHAR(255),
	account_type VARCHAR(20) NOT NULL,
	PRIMARY KEY (user_id),
	CONSTRAINT user_data_email_unique UNIQUE (email),
	CONSTRAINT user_data_account_type_foreign FOREIGN KEY (account_type) REFERENCES account_type(type)
);

-- DROP TABLE user_email;
CREATE TABLE user_email (
	email VARCHAR(100) NOT NULL,
	user_id UUID NULL,
	verified_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (email, user_id),
	CONSTRAINT user_email_user_id FOREIGN KEY (user_id) REFERENCES user_data(user_id)
);

-- DROP TABLE admin_account;
CREATE TABLE admin_account (
	user_id UUID NULL,
	username VARCHAR(100) NULL,
	"password" VARCHAR(100) NULL,
	CONSTRAINT admin_account_username_unique UNIQUE (username),
	CONSTRAINT admin_account_user_id_foreign FOREIGN KEY (user_id) REFERENCES user_data(user_id)
);

-- DROP TABLE facebook_account;
CREATE TABLE facebook_account (
	user_id UUID NULL,
	social_user_id VARCHAR(100) NULL,
	CONSTRAINT facebook_account_social_user_id_unique UNIQUE (social_user_id),
	CONSTRAINT facebook_account_user_id_foreign FOREIGN KEY (user_id) REFERENCES user_data(user_id)
);

-- DROP TABLE google_account;
CREATE TABLE google_account (
	user_id UUID NULL,
	social_user_id VARCHAR(100) NULL,
	CONSTRAINT google_account_social_user_id_unique UNIQUE (social_user_id),
	CONSTRAINT google_account_user_id_foreign FOREIGN KEY (user_id) REFERENCES user_data(user_id)
);

-- DROP TABLE local_account;
CREATE TABLE local_account (
	user_id UUID NULL,
	username VARCHAR(50) NULL,
	"password" VARCHAR(100) NULL,
	CONSTRAINT local_account_username_unique UNIQUE (username),
	CONSTRAINT local_account_user_id_foreign FOREIGN KEY (user_id) REFERENCES user_data(user_id)
);

-- -----------------------------------------------------------------------------------------------------------------

--     ____           _
--    |  _ \ ___  ___| |_ ___
--    | |_) / _ \/ __| __/ __|
--    |  __/ (_) \__ \ |_\__ \
--    |_|   \___/|___/\__|___/

-- DROP TABLE post_status;
CREATE TABLE post_status (
	status VARCHAR(20) NOT NULL,
	CONSTRAINT post_status_pkey PRIMARY KEY (status)
);

-- DROP TABLE post_type;
CREATE TABLE post_type (
	"type" VARCHAR(50),
	PRIMARY KEY (type)
);

-- DROP TABLE property_type;
CREATE TABLE property_type (
	"type" VARCHAR(50),
	PRIMARY KEY (type)
);

-- DROP TABLE post;
CREATE TABLE post (
	post_id UUID,
	user_id UUID NOT NULL,

	post_type VARCHAR(50) NOT NULL,
	property_type VARCHAR(50) NOT NULL,

	status VARCHAR(20) NOT NULL,
	agent_ref VARCHAR(50),

	person_name VARCHAR(20),
	person_type VARCHAR(20),
	person_contact JSONB,
	person_email VARCHAR(100),

	heading VARCHAR(255),
	description TEXT,
	availability_tag VARCHAR(255) NULL,

	price numeric(14,2) NULL,
	price_currency VARCHAR(20) NULL,
	price_tag VARCHAR(20) NULL,

	a_province VARCHAR(255) NULL,
	a_district VARCHAR(255) NULL,
	a_city VARCHAR(255) NULL,
	a_street VARCHAR(255) NULL,
	m_latitude VARCHAR(255) NULL,
	m_longitude VARCHAR(255) NULL,
	m_zoom_level VARCHAR(255) NULL,

	"size" JSONB NULL,
	nearest_bus_stop NUMERIC(8,2) NULL,
	nearest_train_station NUMERIC(8,2) NULL,

	features JSONB NULL,
	extra_details JSONB NULL,

	youtube_link VARCHAR(255) NULL,

	posted_date DATE NULL DEFAULT CURRENT_TIMESTAMP,
	updated_date DATE NULL DEFAULT CURRENT_TIMESTAMP,
	published_date DATE NULL,

	PRIMARY KEY (post_id),
	CONSTRAINT fk_post_user_id FOREIGN KEY (user_id) REFERENCES user_data(user_id),
	CONSTRAINT fk_post_post_type FOREIGN KEY (post_type) REFERENCES post_type("type"),
	CONSTRAINT fk_post_property_type FOREIGN KEY (property_type) REFERENCES property_type("type")
);

--DROP TABLE post_photos;
CREATE TABLE post_photos (
	post_id UUID,
	url VARCHAR(255),
	PRIMARY KEY (post_id, url),
	CONSTRAINT fk_post_photos_post_id FOREIGN KEY(post_id) REFERENCES post(post_id)
);

--DROP TABLE post_plans;
CREATE TABLE post_plans (
	post_id UUID,
	url VARCHAR(255),
	PRIMARY KEY (post_id, url),
	CONSTRAINT fk_post_plans_post_id FOREIGN KEY(post_id) REFERENCES post(post_id)
);



-- DROP TABLE featured_property;
CREATE TABLE featured_property (
	post_id UUID PRIMARY KEY,
	created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT featured_property_post_id_foreign FOREIGN KEY (post_id) REFERENCES post(post_id)
);

-- DROP TABLE favorite_property;
CREATE TABLE favorite_property (
	user_id UUID NOT NULL,
	post_id UUID NOT NULL,
	added_date TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT favorite_property_pkey PRIMARY KEY (user_id, post_id),
	CONSTRAINT favorite_property_post_id_foreign FOREIGN KEY (post_id) REFERENCES post(post_id)
);

-- DROP VIEW post_brief;
CREATE VIEW post_brief AS
	SELECT post_id, post_type, property_type, status, availability_tag,
		   heading, description, price, price_tag, price_currency,
		   a_district, a_city, a_street, m_latitude, m_longitude,
		   nearest_bus_stop, nearest_train_station,
		   "size", features, extra_details,
		   user_id, person_name,
		   COALESCE(pp.photos, '{}') as photos,
		   exists(SELECT post_id FROM featured_property fp WHERE fp.post_id = p.post_id) featured
		  		FROM post p
		  		LEFT JOIN
		  		    (SELECT post_id, array_agg(pp.url) photos FROM post_photos pp GROUP BY post_id) pp USING(post_id);

-- DROP VIEW post_full;
CREATE VIEW post_full AS
    SELECT p.post_id, post_type, property_type, status, availability_tag,
		   heading, description, price, price_tag, price_currency,
		   a_province, a_district, a_city, a_street, m_latitude, m_longitude,
		   nearest_bus_stop, nearest_train_station,
		   "size", features, extra_details,
		   user_id, person_name, person_type, person_contact, agent_ref,
		   COALESCE(pp.photos, '{}') as photos, COALESCE(pp2.plns, '{}') as plans,
		   youtube_link,
		   posted_date, updated_date, published_date,
		   exists(SELECT post_id FROM featured_property fp WHERE fp.post_id = p.post_id) featured
		  		FROM post p
		  		LEFT JOIN
		  			(SELECT post_id, array_agg(pp.url) photos FROM post_photos pp GROUP BY post_id) pp
		  				ON p.post_id = pp.post_id
		  		LEFT JOIN
		  			(SELECT post_id, array_agg(pp2.url) plns FROM post_plans pp2 GROUP BY post_id) pp2
		  				ON p.post_id = pp2.post_id;


-- DROP VIEW featured_property_brief;
CREATE VIEW featured_property_brief AS
	SELECT p.* FROM featured_property fp
		JOIN post_brief p USING(post_id);

-- DROP VIEW favorite_property_brief;
CREATE VIEW favorite_property_brief AS
	SELECT p.*, fp.user_id as viewer_user_id FROM favorite_property fp
		JOIN post_brief p USING (post_id);


--     _        _                          __                  _   _
--    | |_ _ __(_) __ _  __ _  ___ _ __   / _|_   _ _ __   ___| |_(_) ___  _ __  ___
--    | __| '__| |/ _` |/ _` |/ _ \ '__| | |_| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
--    | |_| |  | | (_| | (_| |  __/ |    |  _| |_| | | | | (__| |_| | (_) | | | \__ \
--     \__|_|  |_|\__, |\__, |\___|_|    |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
--                |___/ |___/

CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.updated_date IS NULL THEN
        NEW.updated_date = NOW();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

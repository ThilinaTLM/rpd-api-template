-- Account types
INSERT INTO account_type("type") VALUES
	 ('Local Account'),
	 ('Admin Account'),
	 ('Google Account'),
	 ('Facebook Account');

-- Post status
INSERT INTO post_status(status) VALUES
	 ('Draft'),
	 ('Pending'),
	 ('Published'),
	 ('Rejected'),
	 ('Sold'),
	 ('Canceled');

-- Post types
INSERT INTO post_type("type") VALUES
	 ('For Sale'), ('Rent'), ('Land');

-- Property types
INSERT INTO property_type("type") VALUES
	 ('House'), ('Apartment'), ('Bungalow'), ('Villa'), ('Studio'), ('Commercial'), ('Annexe'), ('Rooms'),
	 ('Bare Land'), ('Cultivated Land'), ('Land with house'), ('Coconut land'), ('Tea land'),
     ('Rubber land'), ('Paddy(rice) land'), ('Beachfront land'), ('Quarry land'),
     ('Cinnamon land'), ('Waterfront (Lake/River)');


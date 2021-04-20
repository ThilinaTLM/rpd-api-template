
-- ADMIN USER
--   username : admin
--   password : 12345
INSERT INTO user_data(user_id, first_name, last_name, email, telephone, avatar, account_type) VALUES (
        '5999a83d-9962-477e-bc96-e759046999e7',
        'Admin','User','admin-user@pweb.com','0777777777',
        'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortWaved',
        'Admin Account'
    );
INSERT INTO admin_account(user_id, username, "password") VALUES
	 ('5999a83d-9962-477e-bc96-e759046999e7','admin','$2b$10$dYRiA1owdX6huF/osUg7/.Ex329OgnHBc5OEhPRz0Q5Ps4BEe4KQS');


-- LOCAL USER
--  username : user
--  password : 12345
INSERT INTO user_data(user_id, first_name, last_name, email, telephone, avatar, account_type) VALUES (
        'eed91265-66d5-49f2-a62f-49c4a79dc115',
        'Test','User','test-user@pweb.com','0712345678',
        'avatars/8094a766-c1c6-4aab-bc53-09c2890bd84d','Local Account'
    );
INSERT INTO local_account (user_id, username, "password") VALUES
	 ('eed91265-66d5-49f2-a62f-49c4a79dc115', 'user', '$2b$10$dYRiA1owdX6huF/osUg7/.Ex329OgnHBc5OEhPRz0Q5Ps4BEe4KQS');

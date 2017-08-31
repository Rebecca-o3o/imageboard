DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    image VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (image, username, title, description) VALUES ('JaUGLhKSVA1mhZDSgtuee3oRXpj1ctSX.png', 'funkychicken', 'Backbone!', 'This photo brings back so many great memories.');
INSERT INTO images (image, username, title, description) VALUES ('rXGNHH6vagqd4RgBmfG5wON2GXDEeNnC.jpg', 'discoduck', 'Elvis', 'We can''t go on together with suspicious minds.');
INSERT INTO images (image, username, title, description) VALUES ('hh5406G20ilBUEMrWshY1FQo1yWCXkDS.jpg ', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');
INSERT INTO images (image, username, title, description) VALUES ('SEDhKiJOAe5oVMA0gaIwbs_A2chRXALc.jpg', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');
INSERT INTO images (image, username, title, description) VALUES ('elUJpVhKMFT4HZedd0e4OUljaQ_QUjRt.jpg', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');
INSERT INTO images (image, username, title, description) VALUES ('A_cGqgrdmJweBFmK1w6XnetxFsWCmDPE.jpg', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');
INSERT INTO images (image, username, title, description) VALUES ('8b_ihN959NGiWaroGmygM5uksK1KBFsh.jpg', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');
INSERT INTO images (image, username, title, description) VALUES ('0pBcnej-c0orDhx1dYFer4ztO8K8lPIc.jpg', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');
INSERT INTO images (image, username, title, description) VALUES ('XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');
INSERT INTO images (image, username, title, description) VALUES ('1eDB5uF4J1GGm-xhvSl55DG_0SL4HUDA.jpg', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');
INSERT INTO images (image, username, title, description) VALUES ('6Jeku5YElJy8RIRvutiuhTjiltj3NS3B.jpg', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');
INSERT INTO images (image, username, title, description) VALUES ('OjertcOTFPFdZOJAxG4D3MeFmXkB2w6Q.png', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');


CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    image_id INTEGER REFERENCES images(id),
    author VARCHAR(255) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (image_id, author, comment) VALUES ('1', 'funkychicken', 'nice image!');

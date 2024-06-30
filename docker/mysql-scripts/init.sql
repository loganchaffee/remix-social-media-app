CREATE DATABASE IF NOT EXISTS remix_social_media;

USE remix_social_media;

CREATE TABLE user (
  id varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  bio longtext,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_admin tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (id)
);

CREATE TABLE follow (
  id varchar(255) NOT NULL,
  follower varchar(255) NOT NULL,
  followee varchar(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY follower (follower),
  KEY followee (followee),
  CONSTRAINT follow_ibfk_1 FOREIGN KEY (follower) REFERENCES user (id) ON DELETE CASCADE,
  CONSTRAINT follow_ibfk_2 FOREIGN KEY (followee) REFERENCES user (id) ON DELETE CASCADE
);

CREATE TABLE post (
  id varchar(255) NOT NULL,
  user_id varchar(255) NOT NULL,
  content varchar(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT post_ibfk_1 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);

CREATE TABLE session (
  id varchar(255) NOT NULL,
  user_id varchar(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expires_at timestamp NOT NULL,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT session_ibfk_1 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);

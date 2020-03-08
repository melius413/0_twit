CREATE TABLE `user` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`username` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`userpw` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`api` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`api_id` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`created` DATETIME NOT NULL,
	`updated` DATETIME NOT NULL,
	`deleted` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `email` (`email`)
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
;

CREATE TABLE `post` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`content` VARCHAR(140) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`img` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci',
	`created` DATETIME NOT NULL,
	`updated` DATETIME NOT NULL,
	`deleted` DATETIME NOT NULL,
	`user_id` INT(11) NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `FK_post_user` (`user_id`), -- KEY???
	CONSTRAINT `FK_post_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
;

CREATE TABLE `tag` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`created` DATETIME NOT NULL,
	`updated` DATETIME NOT NULL,
	`deleted` DATETIME NOT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
;

CREATE TABLE `post_tag` (
	`post_id` INT(11) NOT NULL,
	`tag_id` INT(11) NOT NULL,
	`created` DATETIME NOT NULL,
	`updated` DATETIME NOT NULL,
	PRIMARY KEY (`post_id`, `tag_id`),
	INDEX `FK_post_tag_tag` (`tag_id`), -- KEY??
	CONSTRAINT `FK_post_tag_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
	CONSTRAINT `FK_post_tag_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`)
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
;

CREATE TABLE `follow` (
	`follower_id` INT(11) NOT NULL,
	`following_id` INT(11) NOT NULL,
	`created` DATETIME NOT NULL,
	`updated` DATETIME NOT NULL,
	PRIMARY KEY (`follower_id`, `following_id`),
	INDEX `FK_follow_user_2` (`following_id`),
	CONSTRAINT `FK_follow_user` FOREIGN KEY (`follower_id`) REFERENCES `user` (`id`),
	CONSTRAINT `FK_follow_user_2` FOREIGN KEY (`following_id`) REFERENCES `user` (`id`)
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
;

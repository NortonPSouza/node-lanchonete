-- lanchonete.Permissions definition
DROP TABLE IF EXISTS `permissions`;

CREATE TABLE `permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permission` int NOT NULL,
  `permission_description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCR

INSERT  INTO  permissions (permission, permission_description) VALUES (1,"Admin");
INSERT  INTO  permissions (permission, permission_description) VALUES (2,"Client");
-- lanchonete.Permissions definition
DROP TABLE IF EXISTS `permissions`;

CREATE TABLE `permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL,
  `type_description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT  INTO  permissions (type, type_description) VALUES (1,"Admin");
INSERT  INTO  permissions (type, type_description) VALUES (2,"Client");
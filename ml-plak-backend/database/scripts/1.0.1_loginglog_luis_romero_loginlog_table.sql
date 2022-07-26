CREATE TABLE `loginlog` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user` varchar(60) NOT NULL,
  `action` varchar(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `time` varchar(5) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `session` (
   `id` int(10) NOT NULL AUTO_INCREMENT,
   `user` varchar(60) NOT NULL,
   `usuario_id` int(10) NOT NULL,
   `lastlogin` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
   `time_in` varchar(5) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

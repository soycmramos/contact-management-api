CREATE DATABASE `contatc_management`;
USE contatc_management;

CREATE TABLE `contacts` (
  `id` BINARY(16) PRIMARY KEY NOT NULL,
  `name` VARCHAR(30) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

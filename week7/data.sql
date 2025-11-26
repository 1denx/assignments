-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: website
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `follower_count` int unsigned NOT NULL DEFAULT '0',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'test2','test@test.com','test',0,'2025-11-10 17:28:03'),(2,'test1','test1@test.com','test1',5,'2025-11-10 17:29:39'),(3,'test2','test2@test.com','test2',0,'2025-11-10 17:29:39'),(4,'test3','test3@test.com','test3',10,'2025-11-10 17:29:39'),(5,'test4','test4@test.com','test4',30,'2025-11-10 17:29:39'),(9,'YOYO','qqq@qqq.com','123',0,'2025-11-19 00:00:28'),(10,'kkk','abc@abc.com','123',0,'2025-11-19 00:00:55'),(11,'auth','auth@auth.com','123',0,'2025-11-19 16:30:20'),(12,'yo','yoyoyo@yoyoyo.com','123',0,'2025-11-19 16:48:57'),(13,'qqq','aauth@auth.com','456',0,'2025-11-19 16:51:29'),(14,'AAA','aaa@aaa.com','aaaa',0,'2025-11-19 17:19:32'),(15,'Q_Q','qq@qq.com','123456',0,'2025-11-20 11:10:37'),(16,'one','one@one.com','111',0,'2025-11-20 11:21:18'),(17,'admin','admin@admin.com','123',0,'2025-11-20 11:23:07'),(18,'TT','tt@tt.com','123',0,'2025-11-21 18:18:58'),(19,'newname','two@two.com','222',0,'2025-11-25 21:56:55'),(23,'k','kk@kk.com','123',0,'2025-11-26 18:03:33');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `member_id` int unsigned NOT NULL,
  `content` text NOT NULL,
  `like_count` int unsigned NOT NULL DEFAULT '0',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,1,'Learning MySQL is actually fun!',3,'2025-11-10 21:44:37'),(4,2,'Finally understood how SQL JOIN works!',1,'2025-11-10 21:47:44'),(5,3,'Practicing aggregation functions today.',5,'2025-11-10 21:47:44'),(6,2,'Foreign key errors are tricky but fixable.',1,'2025-11-10 21:49:22'),(8,10,'GOOD NIGHT',0,'2025-11-19 21:41:29'),(9,10,'ONE IN A MILLION! TWICE!',0,'2025-11-19 21:41:35'),(15,10,'TWICE THIS IS FOR IN KAOHSIUNG',0,'2025-11-21 16:19:22'),(16,17,'HELLO WORLD !',0,'2025-11-21 16:26:04'),(17,18,'HELLO WORLD !',0,'2025-11-21 18:19:33');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `query_log`
--

DROP TABLE IF EXISTS `query_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `query_log` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `target_id` int unsigned NOT NULL,
  `searcher_id` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `target_id` (`target_id`),
  KEY `searcher_id` (`searcher_id`),
  CONSTRAINT `query_log_ibfk_1` FOREIGN KEY (`target_id`) REFERENCES `member` (`id`),
  CONSTRAINT `query_log_ibfk_2` FOREIGN KEY (`searcher_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `query_log`
--

LOCK TABLES `query_log` WRITE;
/*!40000 ALTER TABLE `query_log` DISABLE KEYS */;
INSERT INTO `query_log` VALUES (1,5,14,'2025-11-26 20:36:20'),(2,10,14,'2025-11-26 20:36:29'),(3,10,17,'2025-11-26 20:40:55'),(4,10,14,'2025-11-26 20:41:18'),(5,10,17,'2025-11-26 20:43:18'),(6,10,17,'2025-11-26 20:43:26'),(7,4,17,'2025-11-26 20:43:28'),(8,10,17,'2025-11-26 20:43:30'),(9,5,17,'2025-11-26 20:43:32'),(10,10,17,'2025-11-26 20:43:33'),(11,10,14,'2025-11-26 20:43:46'),(12,10,12,'2025-11-26 20:44:18'),(13,10,15,'2025-11-26 20:44:36');
/*!40000 ALTER TABLE `query_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 20:57:43

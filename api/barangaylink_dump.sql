-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: barangaylink
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `announcements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `barangay_id` bigint(20) unsigned NOT NULL,
  `author_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `category` varchar(255) NOT NULL,
  `featured_image_path` varchar(255) DEFAULT NULL,
  `publish_date` timestamp NULL DEFAULT NULL,
  `expiration_date` timestamp NULL DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `announcements_barangay_id_foreign` (`barangay_id`),
  KEY `announcements_author_id_foreign` (`author_id`),
  CONSTRAINT `announcements_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
  CONSTRAINT `announcements_barangay_id_foreign` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `attachable_type` varchar(255) NOT NULL,
  `attachable_id` bigint(20) unsigned NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_by` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attachments_attachable_type_attachable_id_index` (`attachable_type`,`attachable_id`),
  KEY `attachments_uploaded_by_foreign` (`uploaded_by`),
  CONSTRAINT `attachments_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `module` varchar(255) NOT NULL,
  `record_id` bigint(20) unsigned DEFAULT NULL,
  `description` text NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barangays`
--

DROP TABLE IF EXISTS `barangays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `barangays` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barangays`
--

LOCK TABLES `barangays` WRITE;
/*!40000 ALTER TABLE `barangays` DISABLE KEYS */;
INSERT INTO `barangays` VALUES (1,'Amontay','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(2,'Bagroy','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(3,'Bi-ao','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(4,'Canmoros','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(5,'Enclaro','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(6,'Marina','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(7,'Pagla-um','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(8,'Payao','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(9,'Progreso','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(10,'San Jose','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(11,'San Juan','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(12,'San Pedro','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(13,'San Teodoro','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(14,'San Vicente','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL),(15,'Santo Rosario','Binalbagan','Negros Occidental','Region VI','storage/logos/kcW3O1fHDg7UjCGKrayKvL8dHaBcBf9mEb3T8QtT.jpg','2026-08-08 05:09:18','2026-08-08 06:45:42',NULL,NULL,NULL,NULL),(16,'Santol','Binalbagan','Negros Occidental','Region VI',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `barangays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_assignments`
--

DROP TABLE IF EXISTS `emergency_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emergency_assignments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `emergency_report_id` bigint(20) unsigned NOT NULL,
  `responder_id` bigint(20) unsigned NOT NULL,
  `assigned_by` bigint(20) unsigned DEFAULT NULL,
  `acknowledged_at` timestamp NULL DEFAULT NULL,
  `arrived_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emergency_assignments_emergency_report_id_foreign` (`emergency_report_id`),
  KEY `emergency_assignments_responder_id_foreign` (`responder_id`),
  KEY `emergency_assignments_assigned_by_foreign` (`assigned_by`),
  CONSTRAINT `emergency_assignments_assigned_by_foreign` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`),
  CONSTRAINT `emergency_assignments_emergency_report_id_foreign` FOREIGN KEY (`emergency_report_id`) REFERENCES `emergency_reports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `emergency_assignments_responder_id_foreign` FOREIGN KEY (`responder_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_assignments`
--

LOCK TABLES `emergency_assignments` WRITE;
/*!40000 ALTER TABLE `emergency_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `emergency_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_categories`
--

DROP TABLE IF EXISTS `emergency_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emergency_categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_categories`
--

LOCK TABLES `emergency_categories` WRITE;
/*!40000 ALTER TABLE `emergency_categories` DISABLE KEYS */;
INSERT INTO `emergency_categories` VALUES (1,'Fire',NULL,1,'2026-08-08 08:49:24','2026-08-08 08:49:24'),(2,'Medical emergency',NULL,1,'2026-08-08 08:49:24','2026-08-08 08:49:24'),(3,'Accident',NULL,1,'2026-08-08 08:49:24','2026-08-08 08:49:24'),(4,'Flood',NULL,1,'2026-08-08 08:49:24','2026-08-08 08:49:24'),(5,'Crime',NULL,1,'2026-08-08 08:49:24','2026-08-08 08:49:24'),(6,'Other',NULL,1,'2026-08-08 08:49:24','2026-08-08 08:49:24');
/*!40000 ALTER TABLE `emergency_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_reports`
--

DROP TABLE IF EXISTS `emergency_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emergency_reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `barangay_id` bigint(20) unsigned NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `contact_name` varchar(255) NOT NULL,
  `contact_phone` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `description` text DEFAULT NULL,
  `priority` enum('High','Critical') NOT NULL DEFAULT 'Critical',
  `status` enum('REPORTED','ACKNOWLEDGED','RESPONDER ASSIGNED','RESPONDING','ON SITE','RESOLVED','CLOSED','FALSE ALARM') NOT NULL DEFAULT 'REPORTED',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emergency_reports_user_id_foreign` (`user_id`),
  KEY `emergency_reports_barangay_id_foreign` (`barangay_id`),
  KEY `emergency_reports_category_id_foreign` (`category_id`),
  CONSTRAINT `emergency_reports_barangay_id_foreign` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`),
  CONSTRAINT `emergency_reports_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `emergency_categories` (`id`),
  CONSTRAINT `emergency_reports_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_reports`
--

LOCK TABLES `emergency_reports` WRITE;
/*!40000 ALTER TABLE `emergency_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `emergency_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facilities` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `barangay_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `facilities_barangay_id_foreign` (`barangay_id`),
  CONSTRAINT `facilities_barangay_id_foreign` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0000_01_01_000000_create_roles_table',1),(2,'0000_01_01_000001_create_barangays_table',1),(3,'0001_01_01_000000_create_password_reset_tokens_table',1),(4,'0001_01_01_000000_create_sessions_table',1),(5,'0001_01_01_000000_create_users_table',1),(6,'0001_01_01_000001_create_cache_table',1),(7,'0001_01_01_000002_create_jobs_table',1),(8,'2026_08_08_000002_create_resident_profiles_table',1),(9,'2026_08_08_000003_create_staff_profiles_table',1),(10,'2026_08_08_000004_create_responder_profiles_table',1),(11,'2026_08_08_000005_create_report_categories_table',1),(12,'2026_08_08_000006_create_reports_table',1),(13,'2026_08_08_000007_create_report_status_histories_table',1),(14,'2026_08_08_000008_create_report_assignments_table',1),(15,'2026_08_08_000009_create_service_types_table',1),(16,'2026_08_08_000010_create_service_requests_table',1),(17,'2026_08_08_000011_create_service_request_histories_table',1),(18,'2026_08_08_000012_create_emergency_categories_table',1),(19,'2026_08_08_000013_create_emergency_reports_table',1),(20,'2026_08_08_000014_create_emergency_assignments_table',1),(21,'2026_08_08_000015_create_announcements_table',1),(22,'2026_08_08_000016_create_facilities_table',1),(23,'2026_08_08_000017_create_attachments_table',1),(24,'2026_08_08_000018_create_audit_logs_table',1),(25,'2026_08_08_041314_create_personal_access_tokens_table',1),(26,'2026_08_08_041412_create_notifications_table',1),(27,'2026_08_08_141441_add_contact_info_to_barangays_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) unsigned NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',2,'auth_token','ff1eca8a32c2de9123d3983047ed3593c5509a9116d19bc652bdc786f5a2bb08','[\"*\"]','2026-08-08 06:59:40',NULL,'2026-08-08 05:27:52','2026-08-08 06:59:40'),(2,'App\\Models\\User',7,'auth_token','324e57272eaabcfadbe0b7cba25757fff47ea4484597858a481a63106d63c504','[\"*\"]','2026-08-08 06:57:06',NULL,'2026-08-08 06:57:05','2026-08-08 06:57:06'),(3,'App\\Models\\User',7,'auth_token','cd42c165a3950ae9703e577d7629ab4497b84c626cf1cd6d61b92de9657690b3','[\"*\"]','2026-08-08 07:00:00',NULL,'2026-08-08 06:59:59','2026-08-08 07:00:00'),(4,'App\\Models\\User',7,'auth_token','43875db27ca25c8b9cb30fe764ba7a6765a59142b84ed56265878712a0a6503c','[\"*\"]','2026-08-08 09:57:18',NULL,'2026-08-08 07:00:26','2026-08-08 09:57:18');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_assignments`
--

DROP TABLE IF EXISTS `report_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_assignments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` bigint(20) unsigned NOT NULL,
  `responder_id` bigint(20) unsigned NOT NULL,
  `assigned_by` bigint(20) unsigned NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `report_assignments_report_id_foreign` (`report_id`),
  KEY `report_assignments_responder_id_foreign` (`responder_id`),
  KEY `report_assignments_assigned_by_foreign` (`assigned_by`),
  CONSTRAINT `report_assignments_assigned_by_foreign` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`),
  CONSTRAINT `report_assignments_report_id_foreign` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `report_assignments_responder_id_foreign` FOREIGN KEY (`responder_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_assignments`
--

LOCK TABLES `report_assignments` WRITE;
/*!40000 ALTER TABLE `report_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_categories`
--

DROP TABLE IF EXISTS `report_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_categories`
--

LOCK TABLES `report_categories` WRITE;
/*!40000 ALTER TABLE `report_categories` DISABLE KEYS */;
INSERT INTO `report_categories` VALUES (1,'Road damage',NULL,1,'2026-08-08 08:49:23','2026-08-08 08:49:23'),(2,'Flooding',NULL,1,'2026-08-08 08:49:23','2026-08-08 08:49:23'),(3,'Garbage problems',NULL,1,'2026-08-08 08:49:23','2026-08-08 08:49:23'),(4,'Broken streetlights',NULL,1,'2026-08-08 08:49:23','2026-08-08 08:49:23'),(5,'Water problems',NULL,1,'2026-08-08 08:49:23','2026-08-08 08:49:23'),(6,'Public safety',NULL,1,'2026-08-08 08:49:23','2026-08-08 08:49:23'),(7,'Noise complaints',NULL,1,'2026-08-08 08:49:23','2026-08-08 08:49:23');
/*!40000 ALTER TABLE `report_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_status_histories`
--

DROP TABLE IF EXISTS `report_status_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_status_histories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `report_status_histories_report_id_foreign` (`report_id`),
  KEY `report_status_histories_user_id_foreign` (`user_id`),
  CONSTRAINT `report_status_histories_report_id_foreign` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `report_status_histories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_status_histories`
--

LOCK TABLES `report_status_histories` WRITE;
/*!40000 ALTER TABLE `report_status_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_status_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `barangay_id` bigint(20) unsigned NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `priority` enum('Low','Medium','High','Critical') NOT NULL DEFAULT 'Medium',
  `status` enum('SUBMITTED','RECEIVED','VERIFIED','ASSIGNED','IN PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'SUBMITTED',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reports_user_id_foreign` (`user_id`),
  KEY `reports_barangay_id_foreign` (`barangay_id`),
  KEY `reports_category_id_foreign` (`category_id`),
  CONSTRAINT `reports_barangay_id_foreign` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`),
  CONSTRAINT `reports_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `report_categories` (`id`),
  CONSTRAINT `reports_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resident_profiles`
--

DROP TABLE IF EXISTS `resident_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resident_profiles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `address` varchar(255) NOT NULL,
  `emergency_contact_name` varchar(255) DEFAULT NULL,
  `emergency_contact_phone` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `resident_profiles_user_id_foreign` (`user_id`),
  CONSTRAINT `resident_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resident_profiles`
--

LOCK TABLES `resident_profiles` WRITE;
/*!40000 ALTER TABLE `resident_profiles` DISABLE KEYS */;
INSERT INTO `resident_profiles` VALUES (1,7,'Block 1 Lot 1, Binalbagan','Contact 1','09998887761','2026-08-08 05:09:18','2026-08-08 05:09:18'),(2,8,'Block 2 Lot 2, Binalbagan','Contact 2','09998887762','2026-08-08 05:09:18','2026-08-08 05:09:18'),(3,9,'Block 3 Lot 3, Binalbagan','Contact 3','09998887763','2026-08-08 05:09:18','2026-08-08 05:09:18'),(4,10,'Block 4 Lot 4, Binalbagan','Contact 4','09998887764','2026-08-08 05:09:18','2026-08-08 05:09:18'),(5,11,'Block 5 Lot 5, Binalbagan','Contact 5','09998887765','2026-08-08 05:09:18','2026-08-08 05:09:18');
/*!40000 ALTER TABLE `resident_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responder_profiles`
--

DROP TABLE IF EXISTS `responder_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `responder_profiles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `unit` varchar(255) NOT NULL,
  `specialty` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `responder_profiles_user_id_foreign` (`user_id`),
  CONSTRAINT `responder_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responder_profiles`
--

LOCK TABLES `responder_profiles` WRITE;
/*!40000 ALTER TABLE `responder_profiles` DISABLE KEYS */;
INSERT INTO `responder_profiles` VALUES (1,5,'Emergency Response Team','Medic',1,'2026-08-08 05:09:18','2026-08-08 05:09:18'),(2,6,'Emergency Response Team','Medic',1,'2026-08-08 05:09:18','2026-08-08 05:09:18');
/*!40000 ALTER TABLE `responder_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`),
  UNIQUE KEY `roles_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Super Administrator','super-admin',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18'),(2,'Barangay Administrator','barangay-admin',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18'),(3,'Barangay Staff','staff',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18'),(4,'Responder','responder',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18'),(5,'Resident','resident',NULL,'2026-08-08 05:09:18','2026-08-08 05:09:18');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_request_histories`
--

DROP TABLE IF EXISTS `service_request_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_request_histories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `service_request_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `service_request_histories_service_request_id_foreign` (`service_request_id`),
  KEY `service_request_histories_user_id_foreign` (`user_id`),
  CONSTRAINT `service_request_histories_service_request_id_foreign` FOREIGN KEY (`service_request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `service_request_histories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_request_histories`
--

LOCK TABLES `service_request_histories` WRITE;
/*!40000 ALTER TABLE `service_request_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_request_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_requests`
--

DROP TABLE IF EXISTS `service_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `barangay_id` bigint(20) unsigned NOT NULL,
  `service_type_id` bigint(20) unsigned NOT NULL,
  `status` enum('SUBMITTED','UNDER REVIEW','PROCESSING','READY','COMPLETED','RELEASED','REJECTED') NOT NULL DEFAULT 'SUBMITTED',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `service_requests_user_id_foreign` (`user_id`),
  KEY `service_requests_barangay_id_foreign` (`barangay_id`),
  KEY `service_requests_service_type_id_foreign` (`service_type_id`),
  CONSTRAINT `service_requests_barangay_id_foreign` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`),
  CONSTRAINT `service_requests_service_type_id_foreign` FOREIGN KEY (`service_type_id`) REFERENCES `service_types` (`id`),
  CONSTRAINT `service_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_requests`
--

LOCK TABLES `service_requests` WRITE;
/*!40000 ALTER TABLE `service_requests` DISABLE KEYS */;
INSERT INTO `service_requests` VALUES (1,7,15,1,'SUBMITTED','Test request for UI check. Please process ASAP.','2026-08-08 05:45:51','2026-08-08 05:45:51',NULL),(2,7,15,2,'SUBMITTED','Test request for UI check. Please process ASAP.','2026-08-08 05:45:51','2026-08-08 05:45:51',NULL),(3,7,15,3,'SUBMITTED','Test request for UI check. Please process ASAP.','2026-08-08 05:45:51','2026-08-08 05:45:51',NULL);
/*!40000 ALTER TABLE `service_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_types`
--

DROP TABLE IF EXISTS `service_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_types` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `processing_time` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_types`
--

LOCK TABLES `service_types` WRITE;
/*!40000 ALTER TABLE `service_types` DISABLE KEYS */;
INSERT INTO `service_types` VALUES (1,'Barangay Clearance','For employment purposes',NULL,NULL,1,'2026-08-08 05:43:36','2026-08-08 05:43:36'),(2,'Certificate of Indigency','For scholarship',NULL,NULL,1,'2026-08-08 05:45:51','2026-08-08 05:45:51'),(3,'Business Permit','For sari-sari store',NULL,NULL,1,'2026-08-08 05:45:51','2026-08-08 05:45:51'),(4,'Certificate of residency',NULL,NULL,NULL,1,'2026-08-08 08:49:23','2026-08-08 08:49:23'),(5,'Business permit clearance',NULL,NULL,NULL,1,'2026-08-08 08:49:23','2026-08-08 08:49:23');
/*!40000 ALTER TABLE `service_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_profiles`
--

DROP TABLE IF EXISTS `staff_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff_profiles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `position` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_profiles_user_id_foreign` (`user_id`),
  CONSTRAINT `staff_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_profiles`
--

LOCK TABLES `staff_profiles` WRITE;
/*!40000 ALTER TABLE `staff_profiles` DISABLE KEYS */;
INSERT INTO `staff_profiles` VALUES (1,3,'Clerk','Administration','2026-08-08 05:09:18','2026-08-08 05:09:18'),(2,4,'Clerk','Administration','2026-08-08 05:09:18','2026-08-08 05:09:18');
/*!40000 ALTER TABLE `staff_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  `barangay_id` bigint(20) unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `profile_photo_path` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  KEY `users_barangay_id_foreign` (`barangay_id`),
  CONSTRAINT `users_barangay_id_foreign` FOREIGN KEY (`barangay_id`) REFERENCES `barangays` (`id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super','Admin','superadmin@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456789',1,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL),(2,'Barangay','Admin','admin@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456788',2,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL),(3,'Staff','1','staff1@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456701',3,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL),(4,'Staff','2','staff2@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456702',3,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL),(5,'Responder','1','responder1@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456801',4,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL),(6,'Responder','2','responder2@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456802',4,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL),(7,'Resident','1','resident1@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456901',5,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL),(8,'Resident','2','resident2@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456902',5,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL),(9,'Resident','3','resident3@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456903',5,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL),(10,'Resident','4','resident4@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456904',5,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL),(11,'Resident','5','resident5@barangaylink.com',NULL,'$2y$12$3VkNDD0NEfrF8kWOLzWxWe5gkFuQ6.DWk/z.z99dwoTuib2HxFw4O','09123456905',5,15,1,NULL,NULL,'2026-08-08 05:09:18','2026-08-08 05:45:51',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-09  2:44:09

-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 28, 2023 at 05:20 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wikuhotel`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_pemesanans`
--

CREATE TABLE `detail_pemesanans` (
  `id` int(11) NOT NULL,
  `pemesananId` int(11) DEFAULT NULL,
  `kamarId` int(11) DEFAULT NULL,
  `tgl_akses` datetime DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `detail_pemesanans`
--

INSERT INTO `detail_pemesanans` (`id`, `pemesananId`, `kamarId`, `tgl_akses`, `harga`, `createdAt`, `updatedAt`) VALUES
(2, NULL, NULL, NULL, 300000, '2023-02-08 05:39:08', '2023-02-08 05:39:08'),
(3, NULL, 6, '2023-02-10 00:00:00', 300000, '2023-02-08 05:41:22', '2023-02-08 05:41:22'),
(4, NULL, 7, NULL, 300000, '2023-02-08 05:48:30', '2023-02-08 05:48:30'),
(5, NULL, 2, '2023-02-10 00:00:00', 300000, '2023-02-08 05:43:05', '2023-02-08 05:43:05'),
(6, NULL, 7, '2023-02-10 00:00:00', 300000, '2023-02-08 05:44:36', '2023-02-08 05:44:36');

-- --------------------------------------------------------

--
-- Table structure for table `kamars`
--

CREATE TABLE `kamars` (
  `id` int(11) NOT NULL,
  `nomor_kamar` int(11) DEFAULT NULL,
  `tipeKamarId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kamars`
--

INSERT INTO `kamars` (`id`, `nomor_kamar`, `tipeKamarId`, `createdAt`, `updatedAt`) VALUES
(2, 101, 1, '2023-01-18 05:30:40', '2023-01-18 05:46:39'),
(5, 102, 1, '2023-01-18 05:58:37', '2023-01-18 05:58:37'),
(6, 103, 1, '2023-01-18 06:45:03', '2023-01-18 06:45:03'),
(7, 104, 2, '2023-02-01 06:44:09', '2023-02-01 06:44:09');

-- --------------------------------------------------------

--
-- Table structure for table `pemesanans`
--

CREATE TABLE `pemesanans` (
  `id` int(11) NOT NULL,
  `nomor_pemesanan` int(11) DEFAULT NULL,
  `nama_pemesan` varchar(255) DEFAULT NULL,
  `email_pemesan` varchar(255) DEFAULT NULL,
  `tgl_pemesanan` datetime DEFAULT NULL,
  `tgl_check_in` datetime DEFAULT NULL,
  `tgl_check_out` datetime DEFAULT NULL,
  `nama_tamu` varchar(255) DEFAULT NULL,
  `jumlah_kamar` int(11) DEFAULT NULL,
  `tipeKamarId` int(11) DEFAULT NULL,
  `status_pemesanan` enum('baru','check_in','check_out') DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pemesanans`
--

INSERT INTO `pemesanans` (`id`, `nomor_pemesanan`, `nama_pemesan`, `email_pemesan`, `tgl_pemesanan`, `tgl_check_in`, `tgl_check_out`, `nama_tamu`, `jumlah_kamar`, `tipeKamarId`, `status_pemesanan`, `userId`, `createdAt`, `updatedAt`) VALUES
(4, 1, 'rani', 'rain@gmail.com', '2023-02-08 00:00:00', '2023-02-10 00:00:00', '2023-02-17 00:00:00', 'rani', 1, 2, 'check_in', 2, '2023-02-08 05:42:02', '2023-02-08 05:48:30'),
(5, 1, 'rani', 'rain@gmail.com', '2023-02-08 00:00:00', '2023-02-10 00:00:00', '2023-02-17 00:00:00', 'rani', 1, 1, 'baru', NULL, '2023-02-08 05:43:05', '2023-02-08 05:43:05'),
(6, 1, 'rani', 'rain@gmail.com', '2023-02-08 00:00:00', '2023-02-10 00:00:00', '2023-02-17 00:00:00', 'rani', 1, 2, 'baru', 2, '2023-02-08 05:44:36', '2023-02-08 05:44:36');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20230116070009-create-user.js'),
('20230116070502-create-tipe-kamar.js'),
('20230116070628-create-kamar.js'),
('20230116071303-create-pemesanan.js'),
('20230116071504-create-detail-pemesanan.js');

-- --------------------------------------------------------

--
-- Table structure for table `tipe_kamars`
--

CREATE TABLE `tipe_kamars` (
  `id` int(11) NOT NULL,
  `nama_tipe_kamar` varchar(255) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tipe_kamars`
--

INSERT INTO `tipe_kamars` (`id`, `nama_tipe_kamar`, `harga`, `deskripsi`, `foto`, `createdAt`, `updatedAt`) VALUES
(1, 'Standard', 300000, 'Fasilitas normal memadai', 'kamar-1674565168945.png', '2023-01-18 05:18:08', '2023-01-24 12:59:29'),
(2, 'Superior', 400000, 'Double bed', 'kamar-1674545209036.png', '2023-01-24 07:26:49', '2023-01-24 07:26:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama_user` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','resepsionis') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama_user`, `foto`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Rani', 'foto-1674543537707.jpg', 'rain@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'admin', '2023-01-18 05:16:30', '2023-01-24 06:58:57'),
(2, 'Rasyid', 'foto-1674019050726.png', 'rasyid@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b', 'resepsionis', '2023-01-18 05:17:30', '2023-01-18 05:17:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pemesananId` (`pemesananId`),
  ADD KEY `kamarId` (`kamarId`);

--
-- Indexes for table `kamars`
--
ALTER TABLE `kamars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipeKamarId` (`tipeKamarId`);

--
-- Indexes for table `pemesanans`
--
ALTER TABLE `pemesanans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipeKamarId` (`tipeKamarId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tipe_kamars`
--
ALTER TABLE `tipe_kamars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `kamars`
--
ALTER TABLE `kamars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `pemesanans`
--
ALTER TABLE `pemesanans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tipe_kamars`
--
ALTER TABLE `tipe_kamars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_pemesanans`
--
ALTER TABLE `detail_pemesanans`
  ADD CONSTRAINT `detail_pemesanans_ibfk_1` FOREIGN KEY (`pemesananId`) REFERENCES `pemesanans` (`id`),
  ADD CONSTRAINT `detail_pemesanans_ibfk_2` FOREIGN KEY (`kamarId`) REFERENCES `kamars` (`id`);

--
-- Constraints for table `kamars`
--
ALTER TABLE `kamars`
  ADD CONSTRAINT `kamars_ibfk_1` FOREIGN KEY (`tipeKamarId`) REFERENCES `tipe_kamars` (`id`);

--
-- Constraints for table `pemesanans`
--
ALTER TABLE `pemesanans`
  ADD CONSTRAINT `pemesanans_ibfk_1` FOREIGN KEY (`tipeKamarId`) REFERENCES `tipe_kamars` (`id`),
  ADD CONSTRAINT `pemesanans_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

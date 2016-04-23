-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 23, 2016 at 11:36 AM
-- Server version: 5.5.49-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `madAmp`
--

-- --------------------------------------------------------

--
-- Table structure for table `attributes`
--

CREATE TABLE IF NOT EXISTS `attributes` (
  `control` text NOT NULL,
  `visibleStatus` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` (`control`, `visibleStatus`) VALUES
('TR', 1),
('BS', 1),
('BL', 0),
('VO', 1),
('DT', 0),
('MU', 1);

-- --------------------------------------------------------

--
-- Table structure for table `sources`
--

CREATE TABLE IF NOT EXISTS `sources` (
  `sourceName` text NOT NULL,
  `unitAddress` int(11) NOT NULL,
  `positionAddress` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sources`
--

INSERT INTO `sources` (`sourceName`, `unitAddress`, `positionAddress`) VALUES
('Turntable', 0, 1),
('Source 2', 0, 2),
('Source 3', 0, 3),
('Source 4', 0, 4),
('Bluetooth', 0, 5),
('Source 6', 0, 6);

-- --------------------------------------------------------

--
-- Table structure for table `zones`
--

CREATE TABLE IF NOT EXISTS `zones` (
  `zoneName` text CHARACTER SET utf8 NOT NULL,
  `unitAddress` int(1) NOT NULL,
  `positionAddress` int(1) NOT NULL,
  `activeStatus` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `zones`
--

INSERT INTO `zones` (`zoneName`, `unitAddress`, `positionAddress`, `activeStatus`) VALUES
('Master Bedroom', 1, 1, 1),
('Dining Room', 1, 2, 1),
('Living Room', 1, 3, 1),
('Rec Room', 1, 4, 1),
('Jordan''s Room', 1, 5, 1),
('Office', 1, 6, 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

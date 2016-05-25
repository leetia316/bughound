/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50626
Source Host           : localhost:3306
Source Database       : bughound

Target Server Type    : MYSQL
Target Server Version : 50626
File Encoding         : 65001

Date: 2016-02-02 16:01:30
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for bug
-- ----------------------------
DROP TABLE IF EXISTS `bug`;
CREATE TABLE `bug` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submitdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `width` int(11) DEFAULT NULL COMMENT '屏幕宽',
  `height` int(11) DEFAULT NULL COMMENT '屏幕高',
  `dpr` tinyint(4) DEFAULT NULL COMMENT '屏幕dpr',
  `ua` text,
  `pics` text,
  `business` text COMMENT '业务名称',
  `description` text,
  `ptit` text COMMENT '页面标题',
  `purl` text COMMENT '页面链接',
  `state` tinyint(1) unsigned zerofill NOT NULL DEFAULT '0',
  `solver` varchar(32) DEFAULT NULL,
  `solvedate` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_bug_solver` (`solver`),
  CONSTRAINT `fk_bug_solver` FOREIGN KEY (`solver`) REFERENCES `user` (`erp`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `erp` varchar(32) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `createdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastactivedate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最近活跃日期',
  PRIMARY KEY (`erp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

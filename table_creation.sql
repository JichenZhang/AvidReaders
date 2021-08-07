CREATE TABLE `goodreads2`.`author` (
  `Author_ID` INT NOT NULL,
  `Author_Name` VARCHAR(255) NULL,
  `Author_Average_Rating` DECIMAL(3,2) NULL,
  `Average_Ratings_Count` BIGINT NULL,
  PRIMARY KEY (`Author_ID`));

CREATE TABLE `goodreads2`.`adds_to_wishlist`(
	`User_ID` BIGINT NOT NULL,
    `Book_ID` BIGINT NOT NULL,
	primary key (`User_ID`, `Book_ID`));
    
CREATE TABLE `goodreads2`.`is_part_of`(
    `Book_ID` BIGINT NOT NULL,
	`Series_ID` BIGINT NOT NULL,
	primary key (`Book_ID`,`Series_ID`));
    
CREATE TABLE `goodreads2`.`is_similar_to`(
    `Book_ID_1` BIGINT NOT NULL,
    `Book_ID_2` BIGINT NOT NULL,
	primary key (`Book_ID_1`,`Book_ID_2`));

CREATE TABLE `goodreads2`.`is_tagged_as`(
    `Book_ID` BIGINT NOT NULL,
	`Genre_Name` varchar(255) NOT NULL,
	`Is_Tagged_As_Number_Of_Times` bigint null,
	primary key (`Book_ID`,`Genre_Name`));
    
CREATE TABLE `goodreads2`.`is_written_by`(
    `Book_ID` BIGINT NOT NULL,
	`Author_ID` BIGINT NOT NULL,
	primary key (`Book_ID`,`Author_ID`));

CREATE TABLE `goodreads2`.`book` (
  `Book_ID` bigint NOT NULL,
  `Book_Title` VARCHAR(255) NULL,
  `Book_Description` VARCHAR(15000) NULL,
  `Book_Average_Rating` decimal(3,2) NULL,
  `Book_Ratings_Count` bigint NULL,
  `Book_Format` VARCHAR(255) NULL,
  `Book_Number_Of_Pages` bigint NULL,
  `Book_Image` VARCHAR(255) NULL,
  `Work_ID` bigint NULL,
  PRIMARY KEY (`Book_ID`));
  
  CREATE TABLE `goodreads2`.`genre`(
	`Genre_Name` varchar(255) not null,
	primary key (`Genre_Name`));
    
CREATE TABLE `goodreads2`.`series` (
  `Series_ID` bigint NOT NULL,
  `Series_Name` VARCHAR(255) NULL,
  `Series_Description` varchar(8000) NULL,
  `Series_Primary_Work_Count` BIGINT NULL,
  PRIMARY KEY (`Series_ID`));
  
  CREATE TABLE `goodreads2`.`work` (
  `Work_ID` bigint NOT NULL,
  `Work_Ratings_Sum` BIGINT NULL,
  `Work_Ratings_Count` BIGINT NULL,
  `Work_Original_Publish_Date` varchar(10) NULL,
  PRIMARY KEY (`Work_ID`));

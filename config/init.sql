
create database demoApp; 

use demoApp;

create table user
	(
		userName varchar(20) not null,
		password varchar(20),
		email varchar(20)
	);

insert into user(userName, password, email) values("hr1", "hr1", "hr1@");
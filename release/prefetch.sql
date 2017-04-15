create table users (
    id serial,
    phone varchar(20) primary key,
    dname varchar(100) not null,
    is_verified boolean default false
);

create index user_phone on users(phone);

create table groups(
id serial primary key,
uid varchar(20) not null,
gname varchar(40) not null,
is_active boolean default true,
created_at timestamp default current_timestamp,
unique (uid,gname));

create index uid_index on groups(uid);
create index gid_index on groups(id);

create table group_members(
  id serial primary key,
  gid int not null,
  uid varchar(20) not null,
  is_admin boolean default false  
);

create index gmem_gid on group_members(gid);

create table message(
  id serial primary key,
  gid int not null,
  uid varchar(20) not null,
  body text,
  latlong varchar(40),
  sensor_data json ,
  visible_status int default 0,
  created_at timestamp default current_timestamp,
  modified_at timestamp default current_timestamp
);

create index message_gid on message(gid);
create index message_id on message(id);

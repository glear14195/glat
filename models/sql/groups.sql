create table groups(
id serial primary key,
uid varchar(20) not null,  --user id of the creator of group
gname varchar(40) not null,
is_active boolean default true,
created_at timestamp default current_timestamp,
pic_location varchar(100),
unique (uid,gname));

create index uid_index on groups(uid);
create index gid_index on groups(id);

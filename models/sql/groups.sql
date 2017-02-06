create table groups(
gid serial,
uid varchar(20) not null,
gname varchar(40) not null,
is_active boolean default true,
unique (uid,gname));

create index uid_index on groups(uid);
create index gid_index on groups(gid);

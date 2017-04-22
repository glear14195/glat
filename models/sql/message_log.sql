create table message_log(
  id serial primary key,
  gid int not null,
  uid varchar(20) not null,
  mid int not null,
  status smallint default 0,
  modified_at timestamp default current_timestamp
);

create index message_log_index on message_log(gid,uid,mid);


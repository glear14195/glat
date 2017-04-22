create table message_feed(
  id serial primary key,
  gid int not null,
  uid varchar(20) not null,
  mid int not null,
  comment varchar(150) not null,
  created_at timestamp default current_timestamp
);

create index message_feed_index on message_feed(gid,mid);


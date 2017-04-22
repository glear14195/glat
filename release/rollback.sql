alter table group_members DROP column status;

alter table groups drop column pic_location;
alter table users drop column pic_location;

drop table message_log;

drop table message_feed;
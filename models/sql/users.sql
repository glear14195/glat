create table users (
    id serial,
    phone varchar(20) primary key,
    dname varchar(100) not null,
    pic_location varchar(100),
    is_verified boolean default false
);

create index user_phone on users(phone);

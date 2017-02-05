create table users (
    phone varchar(20) primary key,
    dname varchar(100) not null,
    is_verified smallint default 0
);

create index user_phone on users(phone);  
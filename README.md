create database financehelper with encoding='UTF8' owner='postgres';


postgres=# create database financehelper with encoding='UTF8' owner='postgres';
CREATE DATABASE
postgres=# \l
                                   List of databases
     Name      |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges   
---------------+----------+----------+------------+------------+-----------------------
 financehelper | postgres | UTF8     | en_US.utf8 | en_US.utf8 | 
 postgres      | postgres | UTF8     | en_US.utf8 | en_US.utf8 | 
 template0     | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
               |          |          |            |            | postgres=CTc/postgres
 template1     | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
               |          |          |            |            | postgres=CTc/postgres
(4 rows)

postgres=# \d
Did not find any relations.
postgres=# \d
Did not find any relations.
postgres=# use financehelper;
ERROR:  syntax error at or near "use"
LINE 1: use financehelper;
        ^
postgres=# \c financehelper;
Password: 
You are now connected to database "financehelper" as user "postgres".
financehelper=# \d
              List of relations
 Schema |     Name      |   Type   |  Owner   
--------+---------------+----------+----------
 public | Orders        | table    | postgres
 public | Orders_id_seq | sequence | postgres
(2 rows)

financehelper=# select * from orders;
ERROR:  relation "orders" does not exist
LINE 1: select * from orders;
                      ^
financehelper=# select * from Orders;
ERROR:  relation "orders" does not exist
LINE 1: select * from Orders;
                      ^
financehelper=# select * from "Orders";
 id | type | description | quantity | unitaryPrice | totalPrice | date 
----+------+-------------+----------+--------------+------------+------
(0 rows)

financehelper=# select * from "Orders";
 id | type | description | quantity | unitaryPrice | totalPrice | date | createAt | updateAt 
----+------+-------------+----------+--------------+------------+------+----------+----------
(0 rows)

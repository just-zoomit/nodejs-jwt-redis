
1. npm init -y
2. intall :  npm i express jsonwebtoken dotenv
3. npm install --save-dev nodemon


Redis CLI Commands
____
1. Navigate to redis and install OS
   1. Need to start Server then run redis-cli

2. HSET loggedUser:123 name "Fernando Doglio" avatarUrl "https://avatars/dicebear.com/api/big-smile/fernando.svg" role "Dev Advocate"

3. HGET loggedUser:123 name 

4. HSET cart:123 name "Oranges" prod:1:price "2,23"  prod:1:amount "1" prod:2:name "Apples" prod:2:name "Apples" prod:2:price "3,40" prod:2:amount 4

5. HINCRBY cart:123 prod:1:amount 3

6.  HGETALL cart:123

7.  HLEN cart:123

8.  lpush MYLIST "first element" "second element" "final element"

9.  LPOP MYLIST

10. Rpush mylist "first element" "second element" "final element"

FIFO Quene System Creation Steps:
1. Rpush thequene "Carol Shaw" "Elizabeth Carr" "Ernest Ramos"
   * Rpush thequene "Jane Carter" 
   * Rpush thequene "Martha Cooper" 

2. LPOP thequene - excute 4 times 
3. LRANGE thequene 0 2
4. LINSERT Command 
5. Get first and last item of list
   * LRAGNE mylist 0 0
   * LLEN mylist 
   * LRAGNE mylist 5 5
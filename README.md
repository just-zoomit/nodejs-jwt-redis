
1. npm init -y
2. intall :  npm i express jsonwebtoken dotenv
3. npm install --save-dev nodemon
4. npm install mongoose 
5. npm i redis

Configure Mongo DB
1. Nagavite to MongoDB: https://cloud.mongodb.com/v2/6308ff5a3ed5a42f4d99b0d7#/clusters
2. Create Project, Enter Project Name --> Click Create Project
3. Click Build Database -- Click Free - Add Database user and not username and password. You will need it for MongoURI
4. Configure Network Access, set to Allow access from anywhere
5. On cluster tab, click connect.
6. Select Drivers option and get MongoURI
7. Add MongoURI to env file. Note must be off network to connect.

Run Docker Redis Image

1. Spin up docker continer:
   *  docker run -d -p 6379:6379 --name nodejs-redis -v redis-data-nodejs:/data redis --appendonly yes

2. Open Docker to Start deamon
3. Check docker container is running : 
   * docker ps 
   * docker stop nodejs-redis



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

### Source: 
* https://stackoverflow.com/questions/70185436/redis-nodejs-server-error-client-is-closed
import mysql, { createConnection } from 'mysql';

const db = createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'u190761825_app_db',
})

db.connect((err)=>{
    if(err) {console.log("Connection err",err);
         return;}
         console.log("connected");
         
})

export default db;
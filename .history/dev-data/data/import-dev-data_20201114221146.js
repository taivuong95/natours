
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})
const Tour = require('./../../models/tourModel');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
// .connect(process.env.DATABASE_LOCAL, {
    .connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(con => {
    console.log("DB connection successful !");
})


const tours  = JSON.parse(
    fs.readFileSync(`${__dirname}/tours.json`,'utf-8')
);

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
        
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}

console.log(process.argv);
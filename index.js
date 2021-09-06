
const mysql = require('mysql2/promise');

const app = {}

app.init = async () => {
    // prisijungti prie duomenu bazes
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'mushroom',
    });


    // LOGIC BELOW

    let sql = '';
    let rows = [];

    sql = 'SELECT `mushroom`, `price` FROM `mushroom` ORDER BY `mushroom`.`price` DESC';
    [rows] = await connection.execute(sql);
    // LOGIC BELOW
    console.log(rows);

    let price = 0;
    console.log('Grybai:')
    for (let i = 0; i < rows.length; i++) {
        const mushroomName = rows[i].mushroom;
        const mushroomPrice = rows[i].price;

        console.log(`${i + 1}) ${mushroomName} - ${mushroomPrice} EUR / kg`);
    }

    sql = 'SELECT `name` FROM `gatherer`';
    [rows] = await connection.execute(sql);

    const allGatherers = rows.map(obj => obj.name);
    console.log(`Grybautojai: ${allGatherers.join(', ')}.`);



    sql = 'SELECT `mushroom` `price` FROM `mushroom` WHERE `price` = (SELECT MAX(price) FROM `mushroom`);';
    [rows] = await connection.execute(sql);

    const mostExpensiveMushroom = rows.map(obj => obj.price);
    console.log(rows)

    console.log(`Brangiausias grybas yra: ${mostExpensiveMushroom}.`)


    sql = 'SELECT `mushroom` `price` FROM `mushroom` WHERE `price` = (SELECT MIN(price) FROM `mushroom`);';
    [rows] = await connection.execute(sql);

    const cheapestMushroom = rows.map(obj => obj.price);

    console.log(`Pigiausias grybas yra: ${cheapestMushroom}.`)


    sql = 'SELECT * FROM `mushroom` ORDER BY `mushroom`';
    [rows] = await connection.execute(sql);

    let unitsTillKg = 0;

    for (let i = 0; i < rows.length; i++) {
        mushroomWeight = rows[i].weight;
        const mushroomName = rows[i].mushroom;
        unitsTillKg = 1000 / mushroomWeight;

        console.log(`${i + 1}) ${mushroomName} - ${unitsTillKg.toFixed(1).replace(/(\.0*|(?<=(\..*))0*)$/, '')}`);
    }
}

app.init();

module.exports = app; 
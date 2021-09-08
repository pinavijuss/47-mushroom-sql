
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
    const upName = str => {
        return str[0].toUpperCase() + str.slice(1);
    }
    //1

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
    //2

    sql = 'SELECT `name` FROM `gatherer`';
    [rows] = await connection.execute(sql);

    const allGatherers = rows.map(obj => obj.name);
    console.log(`Grybautojai: ${allGatherers.join(', ')}.`);

    //3

    sql = 'SELECT `mushroom` `price` FROM `mushroom` WHERE `price` = (SELECT MAX(price) FROM `mushroom`);';
    [rows] = await connection.execute(sql);

    const mostExpensiveMushroom = rows.map(obj => obj.price);
    console.log(rows)

    console.log(`Brangiausias grybas yra: ${mostExpensiveMushroom}.`)

    //4

    sql = 'SELECT `mushroom` `price` FROM `mushroom` WHERE `price` = (SELECT MIN(price) FROM `mushroom`);';
    [rows] = await connection.execute(sql);

    const cheapestMushroom = rows.map(obj => obj.price);

    console.log(`Pigiausias grybas yra: ${cheapestMushroom}.`)

    //5

    sql = 'SELECT * FROM `mushroom` ORDER BY `mushroom`';
    [rows] = await connection.execute(sql);

    let unitsTillKg = 0;

    for (let i = 0; i < rows.length; i++) {
        mushroomWeight = rows[i].weight;
        const mushroomName = rows[i].mushroom;
        unitsTillKg = 1000 / mushroomWeight;

        console.log(`${i + 1}) ${mushroomName} - ${unitsTillKg.toFixed(1).replace(/(\.0*|(?<=(\..*))0*)$/, '')}`);
    }

    //6 
    sql = 'SELECT `name`, SUM(`count`) as amount \
            FROM `basket` \
            LEFT JOIN `gatherer` \
                ON `gatherer`.`id` = `basket`.`gatherer_id` \
            GROUP BY `basket`.`gatherer_id` \
            ORDER BY `name`';
    [rows] = await connection.execute(sql);

    console.log('Grybu kiekis pas grybautoja:');
    i = 0;
    for (const item of rows) {
        console.log(`${++i}) ${upName(item.name)} - ${item.amount} grybu`);
    }

    //7 

    sql = 'SELECT `name`, SUM(`count` * `price` * `weight`/1000) as amount \
            FROM `basket` \
            LEFT JOIN `gatherer` \
                ON `gatherer`.`id` = `basket`.`gatherer_id` \
                LEFT JOIN `mushroom`\
                ON `mushroom`.`id` = `basket`.`mushroom_id` \
            GROUP BY `basket`.`gatherer_id` \
            ORDER BY `amount` DESC';
    [rows] = await connection.execute(sql);
    console.log(`Grybu krepselio kainos pas grybautoja:`)
    i = 0;
    for (const item of rows) {
        console.log(`${++i}) ${upName(item.name)} - ${+item.amount} EUR`)
    }

}

app.init();

module.exports = app; 
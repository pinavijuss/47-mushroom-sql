
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

}



app.init();

module.exports = app; 
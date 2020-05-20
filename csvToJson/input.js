const fs = require('fs');
const csv = require('csv-parser');

(async ()=>{
    // const result = [];
    // fs.createReadStream('./question.csv', {encoding:"utf8"})
    // .pipe(csv())
    // .on('data', (data) => result.push(data) )
    // .on('end', async ()=>{
    //     console.log(result);
    //     await fs.writeFileSync('./question.json', JSON.stringify(result));
    // })

    console.log(JSON.parse(await fs.readFileSync('./question.json').toString('utf8')));

})();
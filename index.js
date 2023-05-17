const sql = require('mssql')
const express = require('express');
var cors = require('cors')
let config = require('./config.json');
console.log(config)

var app = express();
app.use(cors())
app.use(express.json());

const port = config.port || 3500;

async function getDataMS(req, res) {
    const data = req.body;
    const jsonData = JSON.parse(data.jsondata)
    const connectConfig = {
        server: data.url,
        port: Number(jsonData.port),
        database: data.database,
        user: data.user,
        password: data.password,
        options: {
          trustServerCertificate: true
        }
    }
    // console.log(connectConfig)
    let pool = await sql.connect(connectConfig)
    const r = {}
    r.errCode = 0;
    r.data = [];
    for (let c = 0; c < data.targets.length; c++) {
        const result = await pool.request().query(data.targets[c].rawSql)
        if (data.targets[c].type === 'table') {
            const item = {}
            item.target = data.targets[c].target
            item.type = data.targets[c].type
            item.columns = []
            for (let prop in result.recordset.columns) {
                item.columns.push({
                    text: result.recordset.columns[prop].name
                })
            }
            item.rows = result.recordset.map((obj) => {
                const ary = []
                for (let i = 0; i < item.columns.length; i++) {
                    ary.push(obj[item.columns[i].text])
                }
                return ary
            })
            r.data.push(item)
        }
        if (data.targets[c].type === 'timeseries') {
            const item = {}
            item.target = data.targets[c].target
            item.type = data.targets[c].type
            item.datapoints = []
            item.datapoints = result.recordset.map((obj) => {
                const ary = []
                ary.push(obj.value)
                ary.push(obj.time_sec)
                return ary
            })
            r.data.push(item)
        }
    }
    pool.close()
    res.json(r);
}


async function checkConnect(req, res) {
    const data = req.body;
    const jsonData = JSON.parse(data.jsondata)
    const connectConfig = {
        server: data.url,
        port: Number(jsonData.port),
        database: data.database,
        user: data.user,
        password: data.password,
        options: {
          trustServerCertificate: true
        }
    }
    const r = {
        "errCode": 0
    }
    let pool
    try {
        pool = await sql.connect(connectConfig)
        r.data = 'Success';
    } catch (err) {
        r.errCode = 1
        r.data = 'Connection fail';
    }
    if (pool.close) {
        pool.close();   
    }
    
    res.json(r);
}

app.post('/api/databaseSource/mssql/query', getDataMS)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/databaseSource/mssql/connect', checkConnect)
app.all('/api/databaseSource/mssql/connect', (req, res) => {
    const r = {
        "errCode": 0
    }
    res.json(r);
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
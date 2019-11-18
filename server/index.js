var express = require('express');
var bodyparser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var app = express();
app.use(express.static(__dirname));
app.use(cors());
app.use(bodyparser.urlencoded({ extended : false }));

var cmd_file = 'cmd.txt';
var bteq_path = `./bteq_dir/psql -m 1 < ${__dirname}/`;
var out_file = ` > ${__dirname}/out.bteq`;

async function exec_cmd() {
    try {
        const { stdout, stderr } = await exec(`${bteq_path}${cmd_file}${out_file}`);
        console.log('stdout:', stdout);
    }catch (err) {
        console.error(err);
    };
};

async function run_cmdfile () {
    await exec_cmd();
    try {
        fs.unlinkSync(cmd_file);
    } catch(err) {
        console.error(err);
    }
};

app.post('/', function (req, res) {
    var {'1' : log, '2' : wid, '3' : sel} = JSON.parse(Object.keys(req.body)[0]);
    fs.appendFile(cmd_file, `${log}\n${wid}\n${sel}`, function (err) {
        if (err) throw err;
        run_cmdfile();
        res.end();
    });
});

app.get('/get', function (req, res) {
    try {
        if (fs.existsSync('out.bteq')) {
            fs.readFile('out.bteq', 'utf8', function(err, data) {
                if (err) throw err;
                res.json({ value : data });
            });
        }
    } catch(err) {
        console.error(err);
    }
});

app.listen (process.env.PORT || 3001, process.env.IP || '0.0.0.0',(e) => {
    if (e) throw e;
    console.log("Listen 3001");
});


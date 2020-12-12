var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/get/data', function(req, res, next) {

    var dataType = req.query.dataType;
    var keyword = req.query.keyword;

    if (!(dataType == 'food' || dataType == 'disease' || dataType == 'symptom' || dataType == 'tag' || dataType == 'product' || dataType == 'nutrient')) {
        res.json({ status: 'ERR_WRONG_DATA' });
        return;
    }

    var query = "SELECT * FROM t_" + dataType + 's';
    if (keyword != '') {
        query += " WHERE " + dataType[0] + "_keyword LIKE ?";
        keyword = "%" + keyword + "%";
    }

    o.mysql.query(query, keyword, function(error, result) {
        if (error) {
            console.log(error);
            res.json({ status: 'ERR_MYSQL' });
            return;
        }

        res.json({ status: 'OK', result: { data_list: result } });
    });
});

//데이터 저장
router.post('/save/data', (req, res) => {
    let dataType = req.body.dataType;
    let name = req.body.name
    let keyword = req.body.keyword;
    let effect = '';
    let desc = '';
    let descOver = '';
    
    if (dataType == 'nutrient') {
        effect = req.body.effect;
        desc = req.body.desc;
        descOver = req.body.descOver;

        let params = [name, keyword, effect, desc, descOver];

        let query = "INSERT INTO t_nutrients(n_name, n_keyword, n_effect, n_desc, n_desc_over) VALUES(?, ?, ?, ?, ?)";
        o.mysql.query(query, params, (error, result) => {
            if (error) {
                console.log(error);
                res.json({status: "ERR_DB_INSERT"});
                return;
            }
            res.json({status: "OK"});
        });
    }
});

//데이터 삭제
router.post('/delete/data', (req, res) => {
    let dataType = req.body.dataType;
    let ids = req.body.ids;

    if (ids.length < 1 || dataType.length < 1) {
        res.json({status: 'WRONG_PARAMS'});
        return;
    }

    let query = "DELETE FROM t_" + dataType + "s";
    for (let i = 0; i < ids.length; i++) {
        if (i == 0) {
            query += " WHERE " + dataType[0] + "_id = ?";
        } else {
            query += " OR " + dataType[0] + "_id = ?";
        }
    }

    o.mysql.query(query, ids, (error, result) => {
        if (error) {
            console.log(error);
            res.json({status: "ERR_DB_DELETE"});
            return;
        }
        res.json({status: 'OK'});
    });

});


module.exports = router;

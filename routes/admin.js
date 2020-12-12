var express = require('express');
var router = express.Router();
var formidable = require('formidable');

const AWS = require('aws-sdk');
const fs  = require('fs');

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESSKEYID,
    secretAccessKey: process.env.S3_SECRETKEY,
    region : process.env.S3_REGION
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/index', {
        menu: 'main'
    });
});

router.get('/data/disease', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_disease'
    });
});
router.get('/data/disease/add', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_disease_add'
    });
});


router.get('/data/food', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_food'
    });
});
router.get('/data/food/add', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_food_add'
    });
});



router.get('/data/symptom', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_symptom'
    });
});
router.get('/data/symptom/add', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_symptom_add'
    });
});


router.get('/data/product', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_product'
    });
});
router.get('/data/product/add', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_product_add'
    });
});

router.get('/data/tag', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_tag'
    });
});

router.get('/data/nutrient', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_nutrient'
    });
});


router.get('/data/nutrient/add', function(req, res, next) {
    res.render('admin/index', {
        menu: 'data_nutrient_add'
    });
});







router.get('/test', function(req, res, next) {
    res.render('admin/index', {
        menu: 'test'
    });
});

// router.post('/upload_img', (req, res) => {

//     var form = new formidable.IncomingForm();
//     form.encoding = 'utf-8';
//     form.multiples = true;
//     form.uploadDir = 'upload';
//     form.keepExtensions = true;

//     form.parse(req, (error, params, files) => {

//         if (error) {
//             res.json({ status: 'ERR_UPLOAD' });
//             return;
//         }

//         console.log(files);

//         let image_path = files.image.path;
//         console.log(`image_path: ${image_path}`);

//         var param = {
//             'Bucket': process.env.S3_BECKIT,
//             'Key': 'image/' + image_path, // 저장할 이름
//             'ACL':'public-read',
//             'Body':fs.createReadStream(image_path),
//             'ContentType':'image/jpeg'
//         }

//         s3.upload(param, function(err, data){
//             console.log('err', err);
//             console.log('succ', data);
//             res.json({ status: 'OK'});
//         });

//         // s3.deleteObject({
//         //       Bucket: process.env.S3_BECKIT, // 사용자 버켓 이름
//         //       Key: '1.png' // 버켓 내 경로
//         //     }, (err, data) => {
//         //       if (err) { throw err; }
//         //       console.log('s3 deleteObject ', data)
//         //
//         //       res.json({ status: 'OK'});
//         //     })

//         //이미지 이름 바꾸기
//         // let move_path = image_path.replace('upload/temp', 'upload/idol_looklike_user');

//     });
// })





/* GET home page. */
router.get('/webapi/get/data', function(req, res, next) {

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
router.post('/webapi/save/data', (req, res) => {
    let dataType = req.body.dataType;
    let name = req.body.name;
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
router.post('/webapi/delete/data', (req, res) => {
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


router.post('/webapi/upload/image', (req, res) => {

    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'upload/temp';
    form.multiples = true;
    form.keepExtensions = true;

    form.parse(req, function(error, body, files) {
        if (error) {
            res.json({ status: 'ERR_UPLOAD' });
            return;
        }

        let dataType = body.dataType;
        let mode = body.mode; // THUMBNAIL, IMAGE
        let dataId = body.dataId; // 데이터 아이디
        let order = body.order; // IMAGE일 경우 순서
        
        let imageName = f.generateRandomId() + '.' + files.image.path.split('.')[1];
        let imageFilePath = 'public/images/' + imageName;
        let imagePath = '/images/' + imageName;

        fs.rename(files.image.path, imageFilePath, function() {
            let table = "t_" + dataType + "s";
            let t = dataType[0];

            if (mode == 'THUMBNAIL') {
                // UPDATE data thumbnail
                let query = "UPDATE t_" + table + "s SET " + t + "_thumb_path = ? WHERE " + t + "_id = ?";
                let params = [imagePath, dataId];
                o.mysql.query(query, params, function(error, result) {
                    if (error) {
                        console.log(error);
                        res.json({ status: 'ERR_MYSQL' });
                        return;
                    }

                    res.json({ status: 'OK', imagePath: imagePath });
                });

            } else if (mode == 'IMAGE') {
                // INSERT images
                let query = "INSERT INTO t_images (i_type, i_path, i_target_id, i_order) VALUES (?, ?, ?, ?)";
                let params = ['IMAGE', imagePath, dataId, order];

                o.mysql.query(query, params, function(error, result) {
                    if (error) {
                        console.log(error);
                        res.json({ status: 'ERR_MYSQL' });
                        return;
                    }

                    res.json({ status: 'OK', imagePath: imagePath, order: order });
                });
            }
        });
    });

});


module.exports = router;

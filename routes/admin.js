var express = require('express');
var router = express.Router();
var formidable = require('formidable');

const AWS = require('aws-sdk');
const fs  = require('fs');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');

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
router.get('/data/product/detail/:pId', function(req, res, next) {
    let pId = req.params.pId;

    res.render('admin/index', {
        menu: 'data_product_detail',
        pId: pId
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


router.get('/data/nutrient/detail/:nId', function(req, res, next) {
    let nId = req.params.nId;

    res.render('admin/index', {
        menu: 'data_nutrient_detail',
        nId: nId
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
router.get('/webapi/get/data', function(req, res) {

    let dataType = req.query.dataType;
    let keyword = req.query.keyword;
    let dataId = req.query.dataId;

    if (f.isNone(dataType)) {
        res.json({ status: 'ERR_WRONG_PARAMS' });
        return;
    }

    if (!(dataType == 'food' || dataType == 'disease' || dataType == 'symptom' || dataType == 'tag' || dataType == 'product' || dataType == 'nutrient')) {
        res.json({ status: 'ERR_WRONG_DATA' });
        return;
    }

    let query = "SELECT * FROM t_" + dataType + 's';
    let t = dataType[0];
    let params = [];
    if (!f.isNone(keyword) || !f.isNone(dataId)) query += " WHERE ";

    if (!f.isNone(keyword)) {
        query += t + "_keyword LIKE ?";
        params.push('%' + keyword + '%');
    }

    if (!f.isNone(dataId)) {
        query += t + "_id = ?";
        params.push(dataId);
    }

    o.mysql.query(query, params, function(error, result) {
        if (error) {
            console.log(error);
            res.json({ status: 'ERR_MYSQL' });
            return;
        }

        res.json({ status: 'OK', result: { dataList: result } });
    });
});


//데이터 저장
router.post('/webapi/save/data', (req, res) => {
    let mode = req.body.mode; // ADD, MODIFY
    let dataType = req.body.dataType;
    let dataId = req.body.dataId;
    let name = req.body.name;
    let keyword = req.body.keyword;
    let nutrients = req.body.nutrients;
    let nutrientList = [];
    let thumb = req.body.thumb;
    let images = req.body.images;
    let imagesDetail = req.body.imagesDetail;
    let effect = '';
    let desc = '';
    let descOver = '';
    let subName = '';
    let category = '';
    let price = '';
    let origin = '';
    let manufacturer = '';
    let packingVolume = '';
    let recommended = ''; 
    
    if (f.isNone(mode) || f.isNone(dataType)) {
        res.json({ status: 'ERR_WRONG_PARAMS' });
        return;
    }

    if (mode == 'MODIFY' && f.isNone(dataId)) {
        res.json({ status: 'ERR_NO_DATA_ID' });
        return;
    }

    if (!f.isNone(nutrients)) {
        nutrientList = nutrients.split('|');
    }
    
    let params = [];
    let query = "";

    if (dataType == 'nutrient') {
        effect = req.body.effect;
        desc = req.body.desc;
        descOver = req.body.descOver;

        params = [name, keyword, effect, desc, descOver];

        if (mode == 'ADD') {
            query += "INSERT INTO t_nutrients(n_name, n_keyword, n_effect, n_desc, n_desc_over) VALUES(?, ?, ?, ?, ?)";
        } else {
            query += "UPDATE t_nutrients SET";
            query += " n_name = ?, n_keyword = ?, n_effect = ?, n_desc = ?,";
            query += " n_desc_over = ?, n_updated_date = NOW()";
            query += " WHERE n_id = ?";
            params.push(dataId);
        }

    } else if (dataType == 'product') {
        subName = req.body.subName;
        category = req.body.category;
        price = req.body.price;
        origin = req.body.origin;
        manufacturer = req.body.manufacturer;
        packingVolume = req.body.packingVolume;
        recommended = req.body.recommended;

        params = [name, keyword, price, origin, manufacturer, category, packingVolume, recommended, subName];
        
        if (mode == 'ADD') {
            query += "INSERT INTO t_products(p_name, p_keyword, p_price, p_origin, p_manufacturer, p_category, p_packing_volume, p_recommended, p_sub_name) VALUE(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        } else {
            query += "UPDATE t_products SET";
            query += " p_name = ?, p_keyword = ?, p_price = ?, p_origin = ?, p_manufacturer = ?,";
            query += " p_category = ?, p_packing_volume = ?, p_recommended = ?, p_sub_name = ?, p_thumb_path = ?";
            query += " WHERE p_id = ?";
            query.push(thumb);
            query.push(dataId);
        }
    }

    // INSERT data
    o.mysql.query(query, params, (error, result) => {
        if (error) {
            console.log(error);
            res.json({ status: "ERR_DB_INSERT" });
            return;
        }

        // nutrient일 경우 maps / image 없음
        if (dataType == 'nutrient') {
            res.json({ status: "OK" });
            return;
        }

        let table = "t_maps_" + dataType + "_nutrient";
        let t = "";

        if (dataType == 'product') {
            t = "mpn_";
        } else if (dataType == 'food') {
            t = "mfn_";
        } else if (dataType == 'disease') {
            t = "mdn_";
        } else if (dataType == 'symtom') {
            t = "msn_";
        }

        if (mode == 'ADD') {
            dataId = result.insertId;
        
            // INSERT nutrients maps
            if (nutrientList.length > 0) {
                let query = 'INSERT INTO ' + table + '(' + t + dataType[0] + '_id, ' + t + 'n_id) VALUES';

                nutrientList.forEach((nutrient, index) => {

                    if (index != 0) {
                        query += ', (' + dataId + ', ' + nutrient + ')';                    
                    } else {
                        query += ' (' + dataId + ', ' + nutrient + ')';
                    }
                });

                o.mysql.query(query, (error, result) => {
                    if (error) {
                        console.log(error);
                        res.json({status: "ERR_MYSQL"});
                        return;
                    }

                    res.json({ status: "OK", dataId: dataId });
                });

            } else {
                res.json({ status: "OK", dataId: dataId });
            }

        } else {
            // mode MODIFY
            query = "DELETE FROM " + table + " WHERE " + t + "_" + dataType[0] + "_id = ?";
            params = [dataId];

            // DELETE nutrients maps
            o.mysql.query(query, params, (error, result) => {
                if (error) {
                    console.log(error);
                    res.json({ status: "ERR_MYSQL" });
                    return;
                }

                // INSERT nutrients
                if (nutrientList.length > 0) {
                    let query = 'INSERT INTO ' + table + '(' + t + dataType[0] + '_id, ' + t + 'n_id) VALUES';
    
                    nutrientList.forEach((nutrient, index) => {
    
                        if (index != 0) {
                            query += ', (' + dataId + ', ' + nutrient + ')';                    
                        } else {
                            query += ' (' + dataId + ', ' + nutrient + ')';
                        }
                    });
    
                    o.mysql.query(query, (error, result) => {
                        if (error) {
                            console.log(error);
                            res.json({status: "ERR_MYSQL"});
                            return;
                        }
    
                        updateDataImagesAndResponse(res, dataType, dataId, images, imagesDetail);
                    });
    
                } else {
                    updateDataImagesAndResponse(res, dataType, dataId, images, imagesDetail);
                }
            });
        }

    });

});


// update images and response
function updateDataImagesAndResponse(res, dataType, dataId, images, imagesDetail) {
    let imageList = [];
    let imageDetailList = [];

    if (!f.isNone(images)) imageList = images.split('|');
    if (!f.isNone(imagesDetail)) imagesDetail = imagesDetail.split('|');

    if (imageList.length > 0) {

        // DELETE images 일단 기존 image 지워줌
        let query = "DELETE FROM t_images WHERE i_type = 'DATA_IMAGE' AND i_target_id = ? AND i_data_type = ?";
        let params = [dataId, dataType];

        o.mysql(query, params, function(error, result) {
            if (error) {
                console.log(error);
                res.json({ status: "ERR_MYSQL" });
                return;
            }

            query = "INSERT INTO t_images (i_type, i_path, i_target_id, i_order, i_data_type) VALUES ";
            params = [];
            for (let i = 0; i < imageList.length; i++) {
                let image = imageList[i];
                query += "('DATA_IMAGE', ?, ?, ?, ?)";
                params.push(image);
                params.push(dataId);
                params.push(i + 1);
                params.push(dataType);
            }

            o.mysql(query, params, function(error, result) {
                if (error) {
                    console.log(error);
                    res.json({ status: "ERR_MYSQL" });
                    return;
                }

                if (imageDetailList.length > 0) {
                    // DELETE Detail images
                    query = "DELETE FROM t_images WHERE i_type = 'DATA_IMAGE_DETAIL' AND i_target_id = ? AND i_data_type = ?";
                    params = [dataId, dataType];

                    o.mysql.query(query, params, function(error, result) {
                        if (error) {
                            console.log(error);
                            res.json({ status: "ERR_MYSQL" });
                            return;
                        }

                        // Start INSERT DATA_IMAGE_DETAIL
                        query = "INSERT INTO t_images (i_type, i_path, i_target_id, i_order, i_data_type) VALUES ";
                        params = [];
                        for (let i = 0; i < imageDetailList.length; i++) {
                            let imageDetail = imageDetailList[i];
                            query += "('DATA_IMAGE_DETAIL', ?, ?, ?, ?)";
                            params.push(imageDetail);
                            params.push(dataId);
                            params.push(i + 1);
                            params.push(dataType);
                        }
                        o.mysql.query(query, params, function(error, result) {
                            if (error) {
                                console.log(error);
                                res.json({ status: "ERR_MYSQL" });
                                return;
                            }
                            res.json({ status: "OK" });
                        });
                        // End INSERT DATA_IMAGE_DETAIL

                    });
    
                } else {
                    res.json({ status: "OK" });
                }
            });
        });

    } else {
        if (imageDetailList.length > 0) {
            // DELETE Detail images
            let query = "DELETE FROM t_images WHERE i_type = 'DATA_IMAGE_DETAIL' AND i_target_id = ? AND i_data_type = ?";
            let params = [dataId, dataType];

            o.mysql.query(query, params, function(error, result) {
                if (error) {
                    console.log(error);
                    res.json({ status: "ERR_MYSQL" });
                    return;
                }

                // Start INSERT DATA_IMAGE_DETAIL
                query = "INSERT INTO t_images (i_type, i_path, i_target_id, i_order, i_data_type) VALUES ";
                params = [];
                for (let i = 0; i < imageDetailList.length; i++) {
                    let imageDetail = imageDetailList[i];
                    query += "('DATA_IMAGE_DETAIL', ?, ?, ?, ?)";
                    params.push(imageDetail);
                    params.push(dataId);
                    params.push(i + 1);
                    params.push(dataType);
                }
                o.mysql.query(query, params, function(error, result) {
                    if (error) {
                        console.log(error);
                        res.json({ status: "ERR_MYSQL" });
                        return;
                    }
                    res.json({ status: "OK" });
                });
                // End INSERT DATA_IMAGE_DETAIL

            });

        } else {
            res.json({ status: "OK" });
        }
    }
}


//데이터 삭제
router.post('/webapi/delete/data', (req, res) => {
    let dataType = req.body.dataType;
    let ids = req.body.ids;

    if (ids.length < 1 || dataType.length < 1) {
        res.json({status: 'ERR_WRONG_PARAMS'});
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
        console.log(result);
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
        let mode = body.mode; // THUMB, DATA_IMAGE, DATA_IMAGE_DETAIL
        let dataId = body.dataId; // 데이터 아이디
        let order = body.order; // IMAGE일 경우 순서
        
        let imageName = f.generateRandomId() + '.' + files.image.path.split('.')[1];
        let imageFilePath = 'public/images/' + imageName;
        let imagePath = '/images/' + imageName;

        fs.rename(files.image.path, imageFilePath, function() {
            let table = "t_" + dataType + "s";
            let t = dataType[0];

            if (mode == 'THUMB') {
                // UPDATE data thumbnail
                let query = "UPDATE " + table + " SET " + t + "_thumb_path = ? WHERE " + t + "_id = ?";
                let params = [imagePath, dataId];
                o.mysql.query(query, params, function(error, result) {
                    if (error) {
                        console.log(error);
                        res.json({ status: 'ERR_MYSQL' });
                        return;
                    }

                    res.json({ status: 'OK', imagePath: imagePath });
                });

            } else if (mode == 'DATA_IMAGE' || mode == 'DATA_IMAGE_DETAIL') {
                // INSERT images
                let query = "INSERT INTO t_images (i_type, i_path, i_target_id, i_order, i_data_type) VALUES (?, ?, ?, ?, ?)";
                let params = [mode, imagePath, dataId, order, dataType];

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

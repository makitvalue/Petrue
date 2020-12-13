const inputDetailTitle = document.querySelector('.js-input-detail-title');
const buttonUploadThumb = document.querySelector('.js-button-upload-thumb');
const inputUploadThumb =  document.querySelector('.js-input-upload-thumb');
const divThumbImage =  document.querySelector('.js-div-thumb-image');
const buttonAddKeyword = document.querySelector('.js-button-add-keyword');
const inputKeyword = document.querySelector('.js-input-keyword');
const buttonAddImage = document.querySelector('.js-button-add-image');
const buttonAddImageDetail = document.querySelector('.js-button-add-image-detail');
const inputUploadImage = document.querySelector('.js-input-upload-image');
const inputUploadImageDetail = document.querySelector('.js-input-upload-image-detail');
const buttonModifyData = document.querySelector('.js-button-modify-data');
const dataType = inputHiddenMenu.getAttribute('value').split('data_')[1].split('_detail')[0];
const inputPrice = document.querySelector('.js-input-price');
const inputOrigin = document.querySelector('.js-input-origin');
const inputManufacturer = document.querySelector('.js-input-manufacturer');
const selectProductCategory = document.querySelector('.js-select-product-category');
const inputPackingVolume = document.querySelector('.js-input-packing-volume');
const inputRecommended = document.querySelector('.js-input-recommended');
const inputSubName = document.querySelector('.js-input-sub-name');
const divImageWrapper = document.querySelector('.js-div-image-wrapper');
const divDetailImageWrapper = document.querySelector('.js-div-detail-image-wrapper');
const divRelationshipWrapperNutrient = document.querySelector('.js-div-relationship-wrapper-nutrient');
const inputHiddenDataId = document.querySelector('.js-input-hidden-data-id');
const selectEffect = document.querySelector('.js-select-effect');


function initDataDetail() {
    setDataToDetail(dataType, inputHiddenDataId.value);

    if (dataType != 'nutrient') {

        if(dataType == 'product') {
            let html = '';
            for (let i = 0; i < categories.length; i++) {
                html += '<option value=' + categories[i].categoryId + '>' + categories[i].categoryName + '</option>';
            }

            selectProductCategory.innerHTML = html;


            //이미지 추가
            buttonAddImageDetail.addEventListener('click', function() {
                inputUploadImageDetail.click();
            });

            // 업로드 이미지 파일 변경이벤트 (이미지 업로드 이벤트) 
            inputUploadImageDetail.addEventListener('change', function(event) {
                changeInputImage(event, function(result) {
                    addImageControl(result, inputUploadImageDetail);
                }, function() {

                });
            });
        }


        //썸네일 이미지 업로드
        buttonUploadThumb.addEventListener('click', function() {
            inputUploadThumb.click();
        });

        //썸네일 input file 파일 체인지 리스너 
        inputUploadThumb.addEventListener('change', function(event) {
            changeInputImage(event, function(result) {
                setBackgroundImage(divThumbImage, result);
            }, function() {
                removeBackGroundImage(divThumbImage);
            });

            let thumbForm = new FormData(divThumbImage.parentElement.querySelector('form'));
            fetch('/admin/webapi/upload/image/from/modify', {
                method: 'POST',
                body: thumbForm
            })
            .then(data => data.json())
            .then((response) => {
                if (response.status != 'OK') {
                    alert("썸네일 저장 에러");
                    return;
                }
                setBackgroundImage(divThumbImage, response.imagePath);

            });

        });

        //이미지 추가
        buttonAddImage.addEventListener('click', function() {
            inputUploadImage.click();
        });

        // 업로드 이미지 파일 변경이벤트 (이미지 업로드 이벤트) 
        inputUploadImage.addEventListener('change', function(event) {
            changeInputImage(event, function(result) {
                addImageControl(result, inputUploadImage);
            }, function() {

            });
        });

        // //연관 데이터 추가
        let ButtonsRelationshipAdd = document.querySelectorAll('.wrapper .form-box .relationship-wrapper button');
        ButtonsRelationshipAdd.forEach(function(ButtonRelationshipAdd) {
            ButtonRelationshipAdd.addEventListener('click', function() {
                let dataType = this.getAttribute('data_type');
                
                body.classList.add('overflow-hidden');
                body.insertAdjacentHTML('beforeend', '<div class="overlay" key="DIALOG_SEARCH"></div>');

                let html = '';
                html += '<div class="js-div-dialog-data-search dialog-data-search">';
                    html += '<h1 class="dialog-title"><span>연관 ' + convertDataTypeToString(dataType) + '</span> 찾기</h1>';
                    html += '<div class="controller">';
                        html += '<div class="search-box">';
                            html += '<select>';
                                html += '<option selected>이름</option>';
                            html += '</select>';
                            html += '<input class="js-input-dialog-data-search" type="text" placeholder="검색어를 입력해주세요." />';
                            html += '<button class="default">검색</button>';
                        html += '</div>';
                    html += '</div>';
                    html += '<div class="dialog-body">';
                        html += '<table>';
                            html += '<thead>';
                                html += '<tr>';
                                    html += '<th width="50">#</th>';
                                    if(dataType != 'tag' && dataType != 'nutrient') html += '<th width="150">썸네일</th>';
                                    html += '<th>이름</th>';
                                    html += '<th>키워드</th>';
                                    if (dataType == 'food') html += '<th>섭취가능</th>';
                                    else if (dataType == 'nutrient') html += '<th>효과</th>';
                                    html += '<th>생성일</th>';
                                html += '</tr>';
                            html += '</thead>';
                            html += '<tbody class="js-tbody-data-list"></tbody>';
                        html += '</table>';
                    html += '</div>';
                html += '</div>';

                body.insertAdjacentHTML('beforeend', html);

                let divDialogDataSearch = document.querySelector('.js-div-dialog-data-search');
                let overlay = document.querySelector('.overlay[key=DIALOG_SEARCH]');
                overlay.addEventListener('click', function() {
                    this.remove();
                    divDialogDataSearch.remove();
                    body.classList.remove('overflow-hidden');
                });

                //getData 부분 (줄일수 있으면 줄여야함)
                getDataToDetail(dataType, '');

                let tbodyDataList = divDialogDataSearch.querySelector('.js-tbody-data-list');
                let inputDialogDataSearch = divDialogDataSearch.querySelector('.js-input-dialog-data-search');
                let buttonDialogSearch = divDialogDataSearch.querySelector('.controller .search-box button');

                //검색버튼 클릭 이벤트
                buttonDialogSearch.addEventListener('click', function() {
                    let keyword = inputDialogDataSearch.value.trim();
                    getDataToDetail(dataType, keyword);
                });

                // 엔터키 이벤트 처리
                inputDialogDataSearch.addEventListener('keyup', function(event) {
                    if (event.key == "Enter") {
                        buttonDialogSearch.click();
                    }
                });


            });

        });
    }

    //공통 ADD 함수들
    //키워드 추가
    buttonAddKeyword.addEventListener('click', function() {
        let value = inputKeyword.value.trim();
        let isDuplicated = false;
        let keywords = document.querySelectorAll('.wrapper.detail .form-box .keyword-wrapper p');
        let divKeywordWrapper = buttonAddKeyword.parentElement;

        //키워드 중복검사
        keywords.forEach(function(keyword) {
            if (keyword.innerText.trim() == value) {
                isDuplicated = true;
                return;
            }
        });

        if (isDuplicated) {
            alert("이미 추가된 키워드 입니다.");
            return;
        } 
        
        if (value == '') return;

        divKeywordWrapper.insertAdjacentHTML('beforebegin', '<p>' + value + '</p>');
        inputKeyword.value = '';
        keywords = document.querySelectorAll('.wrapper.detail .form-box .keyword-wrapper p');

        //마지막 키워드에 클릭 리스너 만들기 (키워드 클릭 시 삭제)
        if (keywords.length > 0) {
            keywords[keywords.length-1].addEventListener('click', function() {
                this.remove();
            });
        }

    });

    //저장버튼 클릭 이벤트
    buttonModifyData.addEventListener('click', function() {

        let dataType = this.getAttribute('data_type');
        let name = inputDetailTitle.value.trim();
        let keywords = '';
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
        let nutrients = '';

        let keywordList = [];
        let nutrientList = [];
        let imageUrlList = [];
        let detailImageUrlList = [];

        //키워드 배열에 넣기
        document.querySelectorAll('.wrapper .form-box .keyword-wrapper p').forEach(function(p) {
            keywordList.push(p.innerText);
        });
        keywords = keywordList.join('|');

        if (divRelationshipWrapperNutrient) {
            divRelationshipWrapperNutrient.querySelectorAll('p').forEach(function(p) {
                nutrientList.push(p.getAttribute('id'));
            });
            nutrients = nutrientList.join('|');
            
        }

        if (dataType == 'nutrient') { //영양소 데이터 저장
            effect = document.querySelector('.js-select-effect').value.trim();
            desc = document.querySelector('.js-textarea-desc').value.trim();
            descOver = document.querySelector('.js-textarea-desc-over').value.trim();

            let dataList = {
                mode: 'MODIFY', // EDIT
                dataType: dataType,
                name: name,
                keyword: keywords,
                effect: effect,
                desc: desc,
                descOver: descOver,
                subName: subName,
                category: category,
                price: price,
                origin: origin,
                manufacturer: manufacturer,
                packingVolume: packingVolume,
                recommended: recommended,
                nutrients: nutrients,
                dataId: inputHiddenDataId.value
            };
    
            createSpinner();
            fetch('/admin/webapi/save/data', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataList), // body data type must match "Content-Type" header
            })
            .then(data => data.json())
            .then(function(response) {
                if (response.status != 'OK') {
                    alert("저장 에러 발생");
                    return;
                }
                location.href = '/admin/data/' + dataType;
                return;
    
            });
        } else if (dataType == 'product') { //제품 데이터 저장
            subName = inputSubName.value.trim();
            category = selectProductCategory.value;
            price = inputPrice.value.trim();
            origin = inputOrigin.value.trim();
            manufacturer = inputManufacturer.value.trim();
            packingVolume = inputPackingVolume.value.trim();
            recommended = inputRecommended.value.trim();


            let thumbnail = getBackgroundImage(divThumbImage);

            let allimageList = divImageWrapper.querySelectorAll('.image-box form input');
            let newImageList = [];
            allimageList.forEach(function(image) {
                if (image.value != '') newImageList.push(image); 
            });
            let allDetailImageList = divDetailImageWrapper.querySelectorAll('.image-box form input');
            let newDetailImageList = [];
            allDetailImageList.forEach(function(image) {
                if (image.value != '') newDetailImageList.push(image); 
            });

            let newImageUrlList = [];
            let NewDetailImageUrlList = [];

            let newImageFormList = [];
            newImageList.forEach(function(image) {
                newImageFormList.push(new FormData(image.parentElement));
            });
            
            let newDetailImageFormList = [];
            newDetailImageList.forEach(function(image) {
                newDetailImageFormList.push(new FormData(image.parentElement));
            });

            let imageCnt = newImageFormList.length + newDetailImageFormList.length;
            let responseCnt = 0;

            if (newImageFormList.length > 0 || newDetailImageFormList.length > 0) {

                newImageFormList.forEach(function(form) {
                    fetch('/admin/webapi/upload/image/from/modify', {
                        method: 'POST',
                        body: form
                    })
                    .then(data => data.json())
                    .then((response) => {
                        if (response.status != 'OK') {
                            alert("이미지 저장 에러!");
                            removeSpinner();
                            return;
                        } 
    
                        responseCnt++;
                        newImageUrlList.push(response.imagePath);

                        if (imageCnt == responseCnt) {
                            //끝나면 할거
                            for (let i = 0; i < newImageList.length; i++) {
                                let targetImage = newImageList[i].parentElement.parentElement.querySelector('.image');
                                setBackgroundImage(targetImage, newImageUrlList[i]);
                            
                            }
                            allimageList.forEach(function(image) {
                                let url = getBackgroundImage(image.parentElement.parentElement.querySelector('.image'));
                                imageUrlList.push(url);
                            });

                            for (let i = 0; i < newDetailImageList.length; i++) {
                                let targetImage = newDetailImageList[i].parentElement.parentElement.querySelector('.image');
                                setBackgroundImage(targetImage, NewDetailImageUrlList[i]);
                            }

                            allDetailImageList.forEach(function(image) {
                                let url = getBackgroundImage(image.parentElement.parentElement.querySelector('.image'));
                                detailImageUrlList.push(url);
                            });

                            imageJoinUrls = imageUrlList.join('|');
                            detailImageJoinUrls = detailImageUrlList.join('|'); 
                    
                            let dataList = {
                                mode: 'MODIFY', // EDIT
                                dataType: dataType,
                                name: name,
                                keyword: keywords,
                                effect: effect,
                                desc: desc,
                                descOver: descOver,
                                subName: subName,
                                category: category,
                                price: price,
                                origin: origin,
                                manufacturer: manufacturer,
                                packingVolume: packingVolume,
                                recommended: recommended,
                                nutrients: nutrients,
                                dataId: inputHiddenDataId.value,
                                images: imageJoinUrls,
                                imagesDetail: detailImageJoinUrls,
                                thumb: thumbnail
                            };
                    
                            createSpinner();
                            fetch('/admin/webapi/save/data', {
                                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dataList), // body data type must match "Content-Type" header
                            })
                            .then(data => data.json())
                            .then(function(response) {
                                if (response.status != 'OK') {
                                    alert("저장 에러 발생");
                                    return;
                                }
                    

                                location.href = '/admin/data/' + dataType;
                                return;
                    
                            });
                              
                        }

                    });
                });
    
                newDetailImageFormList.forEach(function(form) {
                    fetch('/admin/webapi/upload/image/from/modify', {
                        method: 'POST',
                        body: form
                    })
                    .then(data => data.json())
                    .then((response) => {
                        if (response.status != 'OK') {
                            alert("이미지 저장 에러!");
                            removeSpinner();
                            return;
                        } 
    
                        responseCnt++;
                        NewDetailImageUrlList.push(response.imagePath);
    
                        if (imageCnt == responseCnt) {
                            //끝나면 할거
                            for (let i = 0; i < newImageList.length; i++) {
                                let targetImage = newImageList[i].parentElement.parentElement.querySelector('.image');
                                setBackgroundImage(targetImage, newImageUrlList[i]);
                            
                            }
                            allimageList.forEach(function(image) {
                                let url = getBackgroundImage(image.parentElement.parentElement.querySelector('.image'));
                                imageUrlList.push(url);
                            });

                            for (let i = 0; i < newDetailImageList.length; i++) {
                                let targetImage = newDetailImageList[i].parentElement.parentElement.querySelector('.image');
                                setBackgroundImage(targetImage, NewDetailImageUrlList[i]);
                            }

                            allDetailImageList.forEach(function(image) {
                                let url = getBackgroundImage(image.parentElement.parentElement.querySelector('.image'));
                                detailImageUrlList.push(url);
                            });


                            imageJoinUrls = imageUrlList.join('|');
                            detailImageJoinUrls = detailImageUrlList.join('|'); 
                    
                            let dataList = {
                                mode: 'MODIFY', // EDIT
                                dataType: dataType,
                                name: name,
                                keyword: keywords,
                                effect: effect,
                                desc: desc,
                                descOver: descOver,
                                subName: subName,
                                category: category,
                                price: price,
                                origin: origin,
                                manufacturer: manufacturer,
                                packingVolume: packingVolume,
                                recommended: recommended,
                                nutrients: nutrients,
                                dataId: inputHiddenDataId.value,
                                images: imageJoinUrls,
                                imagesDetail: detailImageJoinUrls,
                                thumb: thumbnail
                            };
                    
                            createSpinner();
                            fetch('/admin/webapi/save/data', {
                                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dataList), // body data type must match "Content-Type" header
                            })
                            .then(data => data.json())
                            .then(function(response) {
                                if (response.status != 'OK') {
                                    alert("저장 에러 발생");
                                    return;
                                }
                                location.href = '/admin/data/' + dataType;
                                return;
                    
                            });


                        }
                    });
                });

            } else {

                let allimageList = divImageWrapper.querySelectorAll('.image-box form input');
                let allDetailImageList = divDetailImageWrapper.querySelectorAll('.image-box form input');

                allimageList.forEach(function(image) {
                    imageUrlList.push(getBackgroundImage(image.parentElement.parentElement.querySelector('.image')));
                });      
                allDetailImageList.forEach(function(image) {
                    detailImageUrlList.push(getBackgroundImage(image.parentElement.parentElement.querySelector('.image')));
                });         

                let imageJoinUrls = imageUrlList.join('|');
                let detailImageJoinUrls = detailImageUrlList.join('|'); 

                console.log(imageJoinUrls, detailImageJoinUrls);
        
                let dataList = {
                    mode: 'MODIFY', // EDIT
                    dataType: dataType,
                    name: name,
                    keyword: keywords,
                    effect: effect,
                    desc: desc,
                    descOver: descOver,
                    subName: subName,
                    category: category,
                    price: price,
                    origin: origin,
                    manufacturer: manufacturer,
                    packingVolume: packingVolume,
                    recommended: recommended,
                    nutrients: nutrients,
                    dataId: inputHiddenDataId.value,
                    images: imageJoinUrls,
                    imagesDetail: detailImageJoinUrls,
                    thumb: thumbnail
                };
        
                createSpinner();
                fetch('/admin/webapi/save/data', {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataList), // body data type must match "Content-Type" header
                })
                .then(data => data.json())
                .then(function(response) {
                    if (response.status != 'OK') {
                        alert("저장 에러 발생");
                        return;
                    }
                    location.href = '/admin/data/' + dataType;
                    return;
        
                });
            }

        }


    });

}

initDataDetail();

function setDataToDetail(dataType, dataId) {

    createSpinner();

    fetch('/admin/webapi/get/data?' + new URLSearchParams({
        dataType: dataType,
        dataId: dataId
    })) 
    .then(function(data) {
        return data.json();
    })
    .then(function(response) {
        removeSpinner();
        if (response.status != 'OK') {
            console.log('ERROR');
            return;
        }

        let data = response.result.dataList[0];
        let keywordList = [] ;  
        let divKeywordWrapper = buttonAddKeyword.parentElement;

        console.log(data);
    
        if (dataType == 'nutrient') {
            //영양소
            if (data.n_keyword != '') keywordList = data.n_keyword.split('|');

            inputDetailTitle.value = data.n_name;
            if (data.n_effect == "POSITIVE") {
                selectEffect.value = "POSITIVE";
            } else if (data.n_effect == "NORMAL") {
                selectEffect.value = "NORMAL";
            } else if (data.n_effect == "NEGATIVE") {
                selectEffect.value = "NEGATIVE";
            }

            document.querySelector('.js-textarea-desc').innerText = data.n_desc;
            document.querySelector('.js-textarea-desc-over').innerText = data.n_desc_over;
        } else if (dataType == 'product') {
            //제품
            if (data.p_keyword != '') keywordList = data.p_keyword.split('|');
            let imageList = response.result.imageList;
            let DataImages = [];
            let DataDetailImages = [];
            let nutrientList = [];           

            imageList.forEach(function(image) {
                if (image.i_type == 'DATA_IMAGE') DataImages.push(image);
                if (image.i_type == 'DATA_IMAGE_DETAIL') DataDetailImages.push(image);
            });
            
            //그냥 이미지
            DataImages.forEach(function(image) {
                let html = '';
                html += '<div class="image-box">';
                    html += '<select class="default">';
                        for (let i = 0; i < DataImages.length; i++) {
                            if (i+1 == image.i_order) {
                                html += '<option value="' + (i + 1) + '" selected>' + (i + 1) + '</option>';
                            } else {
                                html += '<option value="' + (i + 1) + '">' + (i + 1) + '</option>';
                            }
                        }
                    html += '</select>';
                    html += '<form method="post" enctype="multipart/form-data" temp="FALSE">';
                        html += '<input name="image" type="file" accept="image/jpeg,image/png">';
                    html += '</form>';
                    html += '<div class="image" style="background-image: url(' + image.i_path + ')"></div>';
                html += '</div>';

                buttonAddImage.insertAdjacentHTML('beforebegin', html);
                
                let imageSelectList = divImageWrapper.querySelectorAll('.image-box select');

                //이미지 제거
                let imageList = divImageWrapper.querySelectorAll('.image-box .image');
                if (imageList.length > 0) {
                    imageList[imageList.length-1].addEventListener('click', function() {
                        this.parentElement.remove();
                        resetImageBoxSelect(inputUploadImage);
                    });    
                }

                //select 변경 리스너
                imageSelectList.forEach(function(select) {
                    select.addEventListener('change', function() {
                        let targetIndex = parseInt(select.value);

                        let thisImageBox = select.parentElement;
                        let targetImageBox = divImageWrapper.querySelector('.image-box:nth-child(' + (targetIndex + 1) + ')');


                        let thisCloneInput = thisImageBox.querySelector('form').querySelector('input').cloneNode(false);
                        let targetCloneInput = targetImageBox.querySelector('form').querySelector('input').cloneNode(false);
            
                        let thisImageUrl = getBackgroundImage(thisImageBox.getElementsByClassName("image")[0]);
                        let targetImageUrl = getBackgroundImage(targetImageBox.getElementsByClassName("image")[0]);
            
                        setBackgroundImage(thisImageBox.getElementsByClassName("image")[0], targetImageUrl);
                        setBackgroundImage(targetImageBox.getElementsByClassName("image")[0], thisImageUrl);
            
            
                        targetImageBox.querySelector('form').querySelector('input').remove();
                        targetImageBox.querySelector('form').insertAdjacentElement('beforeend', thisCloneInput);
                        thisImageBox.querySelector('form').querySelector('input').remove();
                        thisImageBox.querySelector('form').insertAdjacentElement('beforeend', targetCloneInput);
            
                        resetImageBoxSelect(inputUploadImage);
            
                    });
                });


            });

            //상세이미지
            DataDetailImages.forEach(function(image) {
                let html = '';
                html += '<div class="image-box">';
                    html += '<select class="default">';
                        for (let i = 0; i < DataDetailImages.length; i++) {
                            if (i+1 == image.i_order) {
                                html += '<option value="' + (i + 1) + '" selected>' + (i + 1) + '</option>';
                            } else {
                                html += '<option value="' + (i + 1) + '">' + (i + 1) + '</option>';
                            }
                        }
                    html += '</select>';
                    html += '<form method="post" enctype="multipart/form-data" temp="FALSE">';
                        html += '<input name="image" type="file" accept="image/jpeg,image/png">';
                    html += '</form>';
                    html += '<div class="image" style="background-image: url(' + image.i_path + ')"></div>';
                html += '</div>';

                buttonAddImageDetail.insertAdjacentHTML('beforebegin', html);
                
                let imageSelectList = divDetailImageWrapper.querySelectorAll('.image-box select');

                //이미지 제거
                let imageList = divDetailImageWrapper.querySelectorAll('.image-box .image');
                if (imageList.length > 0) {
                    imageList[imageList.length-1].addEventListener('click', function() {
                        this.parentElement.remove();
                        resetImageBoxSelect(inputUploadImageDetail);
                    });    
                }

                imageSelectList.forEach(function(select) {
                    select.addEventListener('change', function() {
                        let targetIndex = parseInt(select.value);

                        let thisImageBox = select.parentElement;
                        let targetImageBox = divDetailImageWrapper.querySelector('.image-box:nth-child(' + (targetIndex + 1) + ')');


                        let thisCloneInput = thisImageBox.querySelector('form').querySelector('input').cloneNode(false);
                        let targetCloneInput = targetImageBox.querySelector('form').querySelector('input').cloneNode(false);
            
                        let thisImageUrl = getBackgroundImage(thisImageBox.getElementsByClassName("image")[0]);
                        let targetImageUrl = getBackgroundImage(targetImageBox.getElementsByClassName("image")[0]);
            
                        setBackgroundImage(thisImageBox.getElementsByClassName("image")[0], targetImageUrl);
                        setBackgroundImage(targetImageBox.getElementsByClassName("image")[0], thisImageUrl);
            
            
                        targetImageBox.querySelector('form').querySelector('input').remove();
                        targetImageBox.querySelector('form').insertAdjacentElement('beforeend', thisCloneInput);
                        thisImageBox.querySelector('form').querySelector('input').remove();
                        thisImageBox.querySelector('form').insertAdjacentElement('beforeend', targetCloneInput);
            
                        resetImageBoxSelect(inputUploadImageDetail);
            
                    });
                });


            });

            //연관 영양소
            nutrientList = response.result.nutrientList;
            console.log(nutrientList);
            nutrientList.forEach(function(nutrient) {
                let html = '<p id=' + nutrient.mpn_n_id + '>' + nutrient.n_name + '</p>'
                divRelationshipWrapperNutrient.querySelector('button').insertAdjacentHTML('beforebegin', html);
                
                let pListRelationship = document.querySelectorAll('.wrapper.detail .form-box .relationship-wrapper p');
                pListRelationship.forEach(function(pRelationship) {
                    pRelationship.addEventListener('click', function() {
                        this.remove();
                    });
                });
            });         
    
            if (data.p_keyword != '') keywordList = data.p_keyword.split('|');
            setBackgroundImage(divThumbImage, data.p_thumb_path);
            inputDetailTitle.value = data.p_name;
            inputSubName.value = data.p_sub_name;
            selectProductCategory.value = data.p_category;
            inputPrice.value = data.p_price;
            inputOrigin.value = data.p_origin;
            inputManufacturer.value = data.p_manufacturer;
            inputPackingVolume.value = data.p_packing_volume; 
            inputRecommended.value = data.p_recommended;
        }

        //키워드 처리
        keywordList.forEach(function(keyword) {
            divKeywordWrapper.insertAdjacentHTML('beforebegin', '<p>' + keyword + '</p>');
        });
        let pKeywords = document.querySelectorAll('.wrapper.detail .form-box .keyword-wrapper p');
        pKeywords.forEach(function(p) {
            p.addEventListener('click', function() {
                this.remove();
            })
        });

    });
    
}

function getDataToDetail(dataType, keyword) {
    let tbodyDataList = document.querySelector('.js-tbody-data-list');

    createSpinner();
    tbodyDataList.innerHTML = '';
    
    fetch('/admin/webapi/get/data?' + new URLSearchParams({
        dataType: dataType,
        keyword: keyword
    }))
    .then(function(data) {
        return data.json();
    })
    .then(function(response) {
        removeSpinner();
        
        if (response.status != 'OK') {
            console.log('ERROR');
            return;
        }

        let html = '';
        let dataList = response.result.dataList;

        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i];

            if (dataType == 'food') {
                html += '<tr id="' + data.f_id + '" data_type="' + dataType + '" class="js-tr-data-list">';
                    html += '<td>' + data.f_id + '</td>';
                    html += '<td><div class="thumb" style="background-image: url(/admin/img/sample.jpg);"></div></td>';
                    html += '<td class="name">' + data.f_name + '</td>';
                    html += '<td>' + data.f_keyword + '</td>';
                    html += '<td>' + data.f_eatable + '</td>';
                    html += '<td>' + data.f_created_date.split(' ')[0] + '</td>';
                html += '</tr>';

            } else if (dataType == 'symptom') {
                html += '<tr id="' + data.s_id + '" data_type="' + dataType + '" class="js-tr-data-list">';
                    html += '<td>' + data.s_id + '</td>';
                    html += '<td><div class="thumb" style="background-image: url(/admin/img/sample.jpg);"></div></td>';
                    html += '<td class="name">' + data.s_name + '</td>';
                    html += '<td>' + data.s_keyword + '</td>';
                    html += '<td>' + data.s_created_date.split(' ')[0] + '</td>';
                html += '</tr>';

            } else if (dataType == 'disease') {
                html += '<tr id="' + data.d_id + '" data_type="' + dataType + '" class="js-tr-data-list">';
                    html += '<td>' + data.d_id + '</td>';
                    html += '<td><div class="thumb" style="background-image: url(/admin/img/sample.jpg);"></div></td>';
                    html += '<td class="name">' + data.d_name + '</td>';
                    html += '<td>' + data.d_keyword + '</td>';
                    html += '<td>' + data.d_created_date.split(' ')[0] + '</td>';
                html += '</tr>';

            } else if (dataType == 'product') {
                html += '<tr id="' + data.p_id + '" data_type="' + dataType + '" class="js-tr-data-list">';
                    html += '<td>' + data.p_id + '</td>';
                    html += '<td><div class="thumb" style="background-image: url(/admin/img/sample.jpg);"></div></td>';
                    html += '<td class="name">' + data.p_name + '</td>';
                    html += '<td>' + data.p_keyword + '</td>';
                    html += '<td>' + data.p_created_date.split(' ')[0] + '</td>';
                html += '</tr>';

            } else if (dataType == 'tag') {
                html += '<tr id="' + data.t_id + '" data_type="' + dataType + '" class="js-tr-data-list">';
                    html += '<td>' + data.t_id + '</td>';
                    html += '<td class="name">' + data.t_name + '</td>';
                    html += '<td>' + data.t_keyword + '</td>';
                    html += '<td>' + data.t_created_date.split(' ')[0] + '</td>';
                html += '</tr>';

            } else if (dataType == 'nutrient') {
                html += '<tr id="' + data.n_id + '" data_type="' + dataType + '" class="js-tr-data-list">';
                    html += '<td>' + data.n_id + '</td>';
                    html += '<td class="name">' + data.n_name + '</td>';
                    html += '<td>' + data.n_keyword + '</td>';
                    html += '<td>' + data.n_effect + '</td>';
                    html += '<td>' + data.n_created_date.split(' ')[0] + '</td>';
                html += '</tr>';
            }
        }

        tbodyDataList.innerHTML = html;
        
        //테이블 tr 클릭 이벤트
        const trDataLists = document.querySelectorAll('.js-tr-data-list');
        trDataLists.forEach(function(tr) {
            tr.addEventListener('click', function() {
                let id = this.getAttribute('id');
                let dataType = this.getAttribute('data_type');

                let isDuplicated = false;

                //연관데이터 중복검사
                document.querySelectorAll('.wrapper .form-box[data_type=' + dataType + '] .relationship-wrapper p').forEach(function(p) {
                    if (p.getAttribute('id') == id) {
                        alert('이미 등록된 ' + convertDataTypeToString(dataType) + '입니다.');
                        isDuplicated = true;
                        return;
                    }
                });

                if (isDuplicated) return;

                let name = tr.querySelector('td.name').innerText;
                let html = '<p id="' + id + '">' + name + '</p>';
                
                document.querySelector('.wrapper .form-box .relationship-wrapper button[data_type=' + dataType + ']').insertAdjacentHTML('beforebegin', html);

                document.querySelector('.overlay[key=DIALOG_SEARCH]').remove();
                document.querySelector('.js-div-dialog-data-search').remove();
                body.classList.remove('overflow-hidden');
                                
                //추가된 연관 데이터 클릭 이벤트 (삭제)
                let pListRelationship = document.querySelectorAll('.wrapper.detail .form-box .relationship-wrapper p');
                pListRelationship.forEach(function(pRelationship) {
                    pRelationship.addEventListener('click', function() {
                        this.remove();
                    });
                });
               
            });
        });

    });
}

function addImageControl(result, imageTarget) {
    let newImageBoxIndex = imageTarget.parentElement.parentElement.querySelectorAll('.image-box').length + 1;
    let html = '';
    html += '<div class="image-box">';
        html += '<select class="default">';
            for (var i = 0; i < newImageBoxIndex; i++) {
                if (i == newImageBoxIndex - 1) {
                    html += '<option value="' + (i + 1) + '" selected>' + (i + 1) + '</option>';
                } else {
                    html += '<option value="' + (i + 1) + '">' + (i + 1) + '</option>';
                }
            }
        html += '</select>';
        html += '<form method="post" enctype="multipart/form-data" temp="TRUE"></form>';
        html += '<div class="image" style="background-image: url(' + result + ')"></div>';
    html += '</div>';
    
    if (imageTarget == inputUploadImage) {
        buttonAddImage.insertAdjacentHTML('beforebegin', html);
    } else {
        buttonAddImageDetail.insertAdjacentHTML('beforebegin', html);
    }

    let cloneInput = '';
    if (imageTarget == inputUploadImage) {
        cloneInput = inputUploadImage.cloneNode(false);
    } else {
        cloneInput = inputUploadImageDetail.cloneNode(false);
    }

    //엘리먼트를 넣을떄는 insertAdjacentElement 써야함
    let newInput = imageTarget.parentElement.parentElement.querySelector('.image-box form[temp=TRUE]')
    newInput.insertAdjacentElement('beforeend', cloneInput);
    newInput.setAttribute('temp', 'FALSE');
                  
    if (imageTarget == inputUploadImage) {
        inputUploadImage.value = '';
    } else {
        inputUploadImageDetail.value = '';
    }
    
    // 이미지 추가 될때마다 select option 늘리기
    let imageSelectList = imageTarget.parentElement.parentElement.querySelectorAll('.image-box select');
    imageSelectList.forEach(function(select) {
        let optionCnt = select.length;
        if (optionCnt == newImageBoxIndex) return;
        select.insertAdjacentHTML('beforeend', '<option value="' + newImageBoxIndex + '">' + newImageBoxIndex + '</option>');
    });

    //이미지 제거
    let imageList = imageTarget.parentElement.parentElement.querySelectorAll('.image-box .image');
    if (imageList.length > 0) {
        imageList[imageList.length-1].addEventListener('click', function() {
            this.parentElement.remove();
            resetImageBoxSelect(imageTarget);
        });    
    }
    
    //셀렉트 변경 이벤트 (이미지 순서 바꾸기)
    imageSelectList.forEach(function(select) {
        select.addEventListener('change', function() {
            let targetIndex = parseInt(select.value);

            let thisImageBox = select.parentElement;
            let targetImageBox = imageTarget.parentElement.parentElement.querySelector('.image-wrapper .image-box:nth-child(' + (targetIndex + 1) + ')');

            let thisCloneInput = thisImageBox.querySelector('form').querySelector('input').cloneNode(false);
            let targetCloneInput = targetImageBox.querySelector('form').querySelector('input').cloneNode(false);

            let thisImageUrl = getBackgroundImage(thisImageBox.getElementsByClassName("image")[0]);
            let targetImageUrl = getBackgroundImage(targetImageBox.getElementsByClassName("image")[0]);

            setBackgroundImage(thisImageBox.getElementsByClassName("image")[0], targetImageUrl);
            setBackgroundImage(targetImageBox.getElementsByClassName("image")[0], thisImageUrl);


            targetImageBox.querySelector('form').querySelector('input').remove();
            targetImageBox.querySelector('form').insertAdjacentElement('beforeend', thisCloneInput);
            thisImageBox.querySelector('form').querySelector('input').remove();
            thisImageBox.querySelector('form').insertAdjacentElement('beforeend', targetCloneInput);

            resetImageBoxSelect(imageTarget);

        });
    });
}

// select 재설정
function resetImageBoxSelect(imageTarget) {
    let selectList = imageTarget.parentElement.parentElement.querySelectorAll('.image-box select');
    let totalImageBoxIndex = selectList.length;

    selectList.forEach(function(select, index) {
        let html = '';
        for (let i=0; i<totalImageBoxIndex; i++) {
            if (i == index) {
                html += '<option value="' + (i + 1) + '" selected>' + (i + 1) +'</option>';
            } else {
                html += '<option value="' + (i + 1) + '">' + (i + 1) +'</option>';
            }
        }
        select.innerHTML = '';
        select.insertAdjacentHTML('beforeend', html);
    
    });

}
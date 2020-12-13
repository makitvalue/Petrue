const buttonUploadThumb = document.querySelector('.js-button-upload-thumb');
const inputUploadThumb =  document.querySelector('.js-input-upload-thumb');
const divThumbImage =  document.querySelector('.js-div-thumb-image');
const buttonAddKeyword = document.querySelector('.js-button-add-keyword');
const inputKeyword = document.querySelector('.js-input-keyword');
const buttonAddImage = document.querySelector('.js-button-add-image');
const buttonAddImageDetail = document.querySelector('.js-button-add-image-detail');
const inputUploadImage = document.querySelector('.js-input-upload-image');
const inputUploadImageDetail = document.querySelector('.js-input-upload-image-detail');
const buttonSaveData = document.querySelector('.js-button-save-data');
const dataType = inputHiddenMenu.getAttribute('value').split('data_')[1].split('_add')[0];
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


function initDataAdd() {

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
        let keywords = document.querySelectorAll('.wrapper.add .form-box .keyword-wrapper p');
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
        keywords = document.querySelectorAll('.wrapper.add .form-box .keyword-wrapper p');

        //마지막 키워드에 클릭 리스너 만들기 (키워드 클릭 시 삭제)
        if (keywords.length > 0) {
            keywords[keywords.length-1].addEventListener('click', function() {
                this.remove();
            });
        }

    });

    //저장버튼 클릭 이벤트
    buttonSaveData.addEventListener('click', function() {
        let dataType = this.getAttribute('data_type');
        let name = document.querySelector('.js-input-name').value.trim();
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
        } else if (dataType == 'product') { //제품 데이터 저장
            subName = inputSubName.value.trim();
            category = selectProductCategory.value;
            price = inputPrice.value.trim();
            origin = inputOrigin.value.trim();
            manufacturer = inputManufacturer.value.trim();
            packingVolume = inputPackingVolume.value.trim();
            recommended = inputRecommended.value.trim();
        }


        let dataList = {
            mode: 'ADD', // EDIT
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
            nutrients: nutrients
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
                removeSpinner();
                return;
            }
            let dataId = response.dataId;

            if (dataType == 'nutrient') {
                alert('저장 완료');
                location.href = '/admin/data/nutrient';
                return;
            }

            // thumb
            let form = inputUploadThumb.parentElement;
            let formData = new FormData(form);
            formData.append('dataId', dataId);
            formData.append('mode', 'THUMB');
            formData.append('dataType', dataType);

            let imageFormList = [];
            let imageDetailFormList = [];
            
            fetch('/admin/webapi/upload/image', {
                method: 'POST',
                body: formData
            })
            .then(data => data.json())
            .then((response) => {
                if (response.status != 'OK') {
                    alert("이미지 저장 에러!");
                    removeSpinner();
                    return;
                }

                if (dataType != 'product') {
                    alert('완료');
                    location.href = '/admin/data/' + dataType;
                    return;
                }

                imageFormList = divImageWrapper.querySelectorAll('.image-box form');
                imageDetailFormList = divDetailImageWrapper.querySelectorAll('.image-box form');

                let totalCnt = imageFormList.length + imageDetailFormList.length;

                if (totalCnt == 0) {
                    alert('성공');
                    removeSpinner();
                    return;
                }

                let responseCnt = 0;
                imageFormList.forEach(function(imageForm, index) {
                    
                    formData = new FormData(imageForm);
                    formData.append('dataId', dataId);
                    formData.append('mode', 'DATA_IMAGE');
                    formData.append('dataType', dataType);
                    formData.append('order', index+1);

                    fetch('/admin/webapi/upload/image', {
                        method: 'POST',
                        body: formData
                    })
                    .then(data => data.json())
                    .then((response) => {
                        if (response.status != 'OK') {
                            removeSpinner();
                            alert('이미지 저장 실패');
                            return;
                        }
                        
                        responseCnt++;

                        if (responseCnt == totalCnt) {
                            removeSpinner();
                            alert('저장 완료');
                            location.href = '/admin/data/' + dataType;
                            return;
                        }
                    });

                });

                imageDetailFormList.forEach(function(imageForm, index) {
                    formData = new FormData(imageForm);
                    formData.append('dataId', dataId);
                    formData.append('mode', 'DATA_IMAGE_DETAIL');
                    formData.append('dataType', dataType);
                    formData.append('order', index+1);

                    fetch('/admin/webapi/upload/image', {
                        method: 'POST',
                        body: formData
                    })
                    .then(data => data.json())
                    .then((response) => {
                        if (response.status != 'OK') {
                            removeSpinner();
                            alert('이미지 저장 실패');
                            return;
                        }

                        responseCnt++;

                        if (responseCnt == totalCnt) {
                            removeSpinner();
                            alert('저장 완료');
                            location.href = '/admin/data/' + dataType;
                            return;
                        }
                    });
                });

            });

        });


        // //연관질병 데이터 배열에 넣기
        // document.querySelectorAll('.wrapper .form-box[data_type=disease] .relationship-wrapper p').forEach(function(p) {
        //     disease_list.push(p.getAttribute('id'));
        // });
        // document.querySelectorAll('.wrapper .form-box[data_type=food] .relationship-wrapper p').forEach(function(p) {
        //     food_list.push(p.getAttribute('id'));
        // });
        // document.querySelectorAll('.wrapper .form-box[data_type=symptom] .relationship-wrapper p').forEach(function(p) {
        //     symptom_list.push(p.getAttribute('id'));
        // });
        // document.querySelectorAll('.wrapper .form-box[data_type=product] .relationship-wrapper p').forEach(function(p) {
        //     product_list.push(p.getAttribute('id'));
        // });
        // document.querySelectorAll('.wrapper .form-box[data_type=tag] .relationship-wrapper p').forEach(function(p) {
        //     tag_list.push(p.getAttribute('id'));
        // });    

    });

}

initDataAdd();

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
                let pListRelationship = document.querySelectorAll('.wrapper.add .form-box .relationship-wrapper p');
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
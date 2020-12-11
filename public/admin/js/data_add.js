const buttonUploadThumb = document.querySelector('.js-button-upload-thumb');
const inputUploadThumb =  document.querySelector('.js-input-upload-thumb');
const divThumbImage =  document.querySelector('.js-div-thumb-image');
const buttonAddKeyword = document.querySelector('.js-button-add-keyword');
const inputKeyword = document.querySelector('.js-input-keyword');
const buttonAddImage = document.querySelector('.js-button-add-image');
const inputUploadImage = document.querySelector('.js-input-upload-image');
const buttonSaveData = document.querySelector('.js-button-save-data');

function initDataAdd() {
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
        })
    });

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

    //이미지 추가
    buttonAddImage.addEventListener('click', function() {
        inputUploadImage.click();
    });

    // 업로드 이미지 파일 변경이벤트 (이미지 업로드 이벤트) 
    inputUploadImage.addEventListener('change', function(event) {
        changeInputImage(event, function(result) {
            let newImageBoxIndex = document.querySelectorAll('.wrapper.add .form-box .image-wrapper .image-box').length + 1;
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
            
            buttonAddImage.insertAdjacentHTML('beforebegin', html);

            let cloneInput = inputUploadImage.cloneNode(false);
            //엘리먼트를 넣을떄는 insertAdjacentElement 써야함
            let newInput = document.querySelector('.wrapper .form-box .image-wrapper .image-box form[temp=TRUE]');
            newInput.insertAdjacentElement('beforeend', cloneInput);
            newInput.setAttribute('temp', 'FALSE');
            inputUploadImage.value = '';              
            
            // 이미지 추가 될때마다 select option 늘리기
            let imageSelectList = document.querySelectorAll('.wrapper .form-box .image-wrapper .image-box select');
            imageSelectList.forEach(function(select) {
                let optionCnt = select.length;
                if (optionCnt == newImageBoxIndex) return;
                select.insertAdjacentHTML('beforeend', '<option value="' + newImageBoxIndex + '">' + newImageBoxIndex + '</option>');
            });

            //이미지 제거
            let imageList = document.querySelectorAll('.wrapper.add .form-box .image-wrapper .image-box .image');
            if (imageList.length > 0) {
                imageList[imageList.length-1].addEventListener('click', function() {
                    this.parentElement.remove();
                    resetImageBoxSelect();
                });
                
            }
            
            //셀렉트 변경 이벤트 (이미지 순서 바꾸기)
            imageSelectList.forEach(function(select) {
                select.addEventListener('change', function() {
                    let targetIndex = parseInt(select.value);

                    let thisImageBox = select.parentElement;
                    let targetImageBox = document.querySelector('.wrapper .form-box .image-wrapper .image-box:nth-child(' + (targetIndex + 1) + ')');
    
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


                    // targetImageBox.getElementsByTagName("form")[0].innerHTML(thisCloneInput);
                    // thisImageBox.getElementsByTagName("form")[0].innerHTML(targetCloneInput);

                    resetImageBoxSelect();

                });
            });



        }, function() {

        });
    });

    //연관 데이터 추가
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
                                if(dataType != 'tag') html += '<th width="150">썸네일</th>';
                                html += '<th>이름</th>';
                                html += '<th>키워드</th>';
                                if (dataType == 'food') html += '<th>섭취가능</th>';
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
            getDataToAdd(dataType, '');

            let tbodyDataList = divDialogDataSearch.querySelector('.js-tbody-data-list');
            let inputDialogDataSearch = divDialogDataSearch.querySelector('.js-input-dialog-data-search');
            let buttonDialogSearch = divDialogDataSearch.querySelector('.controller .search-box button');

            //검색버튼 클릭 이벤트
            buttonDialogSearch.addEventListener('click', function() {
                let keyword = inputDialogDataSearch.value.trim();
                getDataToAdd(dataType, keyword);
            });

            // 엔터키 이벤트 처리
            inputDialogDataSearch.addEventListener('keyup', function(event) {
                if (event.key == "Enter") {
                    buttonDialogSearch.click();
                }
            });

        });

    });

    //추가된 연관 데이터 클릭 이벤트 (삭제)
    let pListRelationship = document.querySelectorAll('.wrapper.add .form-box .relationship-wrapper p');
    pListRelationship.forEach(function(pRelationship) {
        pRelationship.addEventListener('click', function() {
            this.remove();
        });
    });

    //저장버튼 클릭 이벤트
    buttonSaveData.addEventListener('click', function() {
        let dataType = this.getAttribute('data_type');
        let name = document.querySelector('.js-input-name').value.trim();
        let desc1 = document.querySelector('.js-textarea-desc1').value.trim();
        let desc2 = document.querySelector('.js-textarea-desc2').value.trim();
        let keyword = '';
        let disease_list = [];
        let food_list = [];
        let symptom_list = [];
        let product_list = [];
        let tag_list = [];

        let keyword_list = [];

        //키워드 배열에 넣기
        document.querySelectorAll('.wrapper .form-box .keyword-wrapper p').forEach(function(p) {
            keyword_list.push(p.innerText);
        });
        keyword = keyword_list.join('|');

        //연관질병 데이터 배열에 넣기
        document.querySelectorAll('.wrapper .form-box[data_type=disease] .relationship-wrapper p').forEach(function(p) {
            disease_list.push(p.getAttribute('id'));
        });
        document.querySelectorAll('.wrapper .form-box[data_type=food] .relationship-wrapper p').forEach(function(p) {
            food_list.push(p.getAttribute('id'));
        });
        document.querySelectorAll('.wrapper .form-box[data_type=symptom] .relationship-wrapper p').forEach(function(p) {
            symptom_list.push(p.getAttribute('id'));
        });
        document.querySelectorAll('.wrapper .form-box[data_type=product] .relationship-wrapper p').forEach(function(p) {
            product_list.push(p.getAttribute('id'));
        });
        document.querySelectorAll('.wrapper .form-box[data_type=tag] .relationship-wrapper p').forEach(function(p) {
            tag_list.push(p.getAttribute('id'));
        });


        console.log(dataType);
        console.log(name);
        console.log(desc1);
        console.log(desc2);
        console.log(keyword);
        console.log(disease_list);
        console.log(food_list);
        console.log(symptom_list);
        console.log(product_list);
        console.log(tag_list);        

    });

}

initDataAdd();

function getDataToAdd(dataType, keyword) {
    let tbodyDataList = document.querySelector('.js-tbody-data-list');

    createSpinner();
    tbodyDataList.innerHTML = '';
    
    fetch('/webapi/get/data?' + new URLSearchParams({
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
        let dataList = response.result.data_list;

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
                    html += '<td>' + data.n_desc + '</td>';
                    html += '<td>' + data.n_desc_over + '</td>';
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
               
            });
        });

    });
}

// select 재설정
function resetImageBoxSelect() {
    let selectList = document.querySelectorAll('.wrapper .form-box .image-wrapper .image-box select');
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
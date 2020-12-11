
const inputHiddenMenu = document.querySelector('.js-input-hidden-menu');
const tbodyDataList = document.querySelector('.js-tbody-data-list');
const inputDataSearch = document.querySelector('.js-input-data-search');
const buttonDataSearch = document.querySelector('.js-button-data-search');
const dataType = tbodyDataList.getAttribute('data_type');
const buttonSelectedRemove = document.querySelector('.js-button-selected-remove');
const buttonSelectAll = document.querySelector('.js-button-select-all');
const buttonAddTag = document.querySelector('.js-button-add-tag');


//목록들 데이터 가져오기
function getData(keyword) {
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
                //tr 자신이 selected 됐는지 확인
                if (tr.classList.contains('selected')) {
                    tr.classList.remove('selected');
                } else {
                    tr.classList.add('selected');
                }

                //데이터 바텀 메뉴 컨트롤 
                controlDataBottomMenu();
            });
        });

    });

}

//데이터 바텀 메뉴 컨트롤
function controlDataBottomMenu() {
    
    let selectedTr = document.querySelectorAll('.js-tr-data-list.selected');
    let dataBottomMenu = document.querySelector('.js-data-bottom-menu');

    //메뉴 올리고 내리기
    if (selectedTr.length === 1) {
        dataBottomMenu.animate([
            { bottom: '0px' }
        ], {
            duration: 300,
            fill: "forwards"
        });
    } else {
        dataBottomMenu.animate([
            { bottom: '-72px' }
        ], {
            duration: 300,
            fill: "forwards"
        });
    }
    //"선택된 데이터 삭제" 버튼 비/활성화 컨트롤
    if (selectedTr.length > 0) {
        buttonSelectedRemove.classList.remove('disabled');
    } else {
        buttonSelectedRemove.classList.add('disabled');
    }
}


function initData() {

    // 최초 데이터 로드
    getData('');

    // 검색 버튼 클릭 이벤트
    buttonDataSearch.addEventListener('click', function() {
        let keyword = inputDataSearch.value.trim();
        getData(keyword);
    });

    // 검색창 엔터키 이벤트
    inputDataSearch.addEventListener('keyup', function(key) {
        if (key.keyCode == 13) {
            buttonDataSearch.click();
        }
    });
    
    //전체 선택 버튼 클릭이벤트
    buttonSelectAll.addEventListener('click', function() {
        let allTr = document.querySelectorAll('table tbody tr');
        let selectedTr = document.querySelectorAll('table tbody tr.selected');

        if (allTr.length === selectedTr.length) {
            selectedTr.forEach(function(tr) {
                tr.classList.remove('selected');
                buttonSelectedRemove.classList.add('disabled');
            });
        } else {
            allTr.forEach(function(tr) {
                tr.classList.add('selected');
                buttonSelectedRemove.classList.remove('disabled');
            });
        }
        
    });

    //선택된 데이터 삭제
    buttonSelectedRemove.addEventListener('click', function() {
        let selectedTr = document.querySelectorAll('table tbody tr.selected');
        if(this.classList.contains('disabled') || selectedTr.length === 0 ) {
            return;
        }
        alert("삭제버튼 정상동작");
    });
    
    //데이터관리 > 태그 일때 "태그 데이터 추가" 버튼 클릭 이벤트
    if (dataType == 'tag') {
        buttonAddTag.addEventListener('click', function(){

            let html = '';
            html += '<div class="js-div-dialog-add-tag dialog-add-tag">';
                html += '<h1 class="dialog-title">태그 데이터 추가</h1>';
                html += '<div class="dialog-body">';
                    html += '<div class="form-box">';
                        html += '<p class="form-title">이름</p>';
                        html += '<input class="default" type="text" />';
                    html += '</div>';
                    html += '<div class="form-box">';
                        html += '<p class="form-title">키워드</p>';
                        html += '<div class="js-div-tag-keyword-wrapper keyword-wrapper">';
                            html += '<div class="keyword-input">';
                                html += '<input class="js-input-keyword-tag default" type="text" />';
                                html += '<button class="js-button-add-keyword-tag default"><i class="fal fa-plus"></i></button>';
                            html += '</div>';
                        html += '</div>';
                    html += '</div>';
                html += '</div>';
                html += '<div class="dialog-footer">';
                    html += '<button class="js-button-save-tag-cancel default cancel">취소</button>';
                    html += '<button class="js-button-save-tag default">저장</button>';
                html += '</div>';
            html += '</div>';
            

            body.insertAdjacentHTML('beforeend', '<div class="overlay js-div-tag-overlay" key="DIALOG_ADD_TAG"></div>');
            body.classList.add('overflow-hidden');
            body.insertAdjacentHTML('beforeend', html);

            let divDialogAddTag = document.querySelector('.js-div-dialog-add-tag');
            let buttonSaveTagCancel = document.querySelector('.js-button-save-tag-cancel');
            let buttonSaveTag = document.querySelector('.js-button-save-tag');
            let buttonAddKeywordTag = document.querySelector('.js-button-add-keyword-tag');
            let divTagOverlay = document.querySelector('.js-div-tag-overlay');
            let inputKeywordTag = document.querySelector('.js-input-keyword-tag');
            let divKeywordWrapper = buttonAddKeywordTag.parentElement;

            //취소버튼 클릭 이벤트
            buttonSaveTagCancel.addEventListener('click', function() {
                divTagOverlay.remove();
                divDialogAddTag.remove();
            });

            //완료버튼 클릭 이벤트
            buttonSaveTag.addEventListener('click', function() {
                alert('완료버튼클릭');
            });

            //키워드추가 버튼(+버튼) 클릭 이벤트
            buttonAddKeywordTag.addEventListener('click', function() {
                let value = inputKeywordTag.value.trim();
                let isDuplicated = false;
                let keywords = document.querySelectorAll('.js-div-dialog-add-tag .dialog-body .form-box .keyword-wrapper p');

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
                inputKeywordTag.value = '';
                keywords = document.querySelectorAll('.js-div-dialog-add-tag .dialog-body .form-box .keyword-wrapper p');

                //마지막 키워드에 클릭 리스너 만들기 (키워드 클릭 시 삭제)
                if (keywords.length > 0) {
                    keywords[keywords.length-1].addEventListener('click', function() {
                        this.remove();
                    });
                }

                            
            });

        });
    }
}
initData();

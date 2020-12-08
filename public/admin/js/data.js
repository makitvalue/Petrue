
const inputHiddenMenu = document.querySelector('.js-input-hidden-menu');
const tbodyDataList = document.querySelector('.js-tbody-data-list');
const inputDataSearch = document.querySelector('.js-input-data-search');
const buttonDataSearch = document.querySelector('.js-button-data-search');
const dataType = 'nutrient'; // tbodyDataList.getAttribute('data_type');


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
                html += '<tr id="' + data.f_id + '" data_type="' + dataType + '">';
                    html += '<td>' + data.f_id + '</td>';
                    html += '<td><div class="thumb" style="background-image: url(/img/sample.jpg);"></div></td>';
                    html += '<td class="name">' + data.f_name + '</td>';
                    html += '<td>' + data.f_keyword + '</td>';
                    html += '<td>' + data.f_eatable + '</td>';
                    html += '<td>' + data.f_created_date.split(' ')[0] + '</td>';
                html += '</tr>';

            } else if (dataType == 'symptom') {
                html += '<tr id="' + data.s_id + '" data_type="' + dataType + '">';
                    html += '<td>' + data.s_id + '</td>';
                    html += '<td><div class="thumb" style="background-image: url(/img/sample.jpg);"></div></td>';
                    html += '<td class="name">' + data.s_name + '</td>';
                    html += '<td>' + data.s_keyword + '</td>';
                    html += '<td>' + data.s_created_date.split(' ')[0] + '</td>';
                html += '</tr>';

            } else if (dataType == 'disease') {
                html += '<tr id="' + data.d_id + '" data_type="' + dataType + '">';
                    html += '<td>' + data.d_id + '</td>';
                    html += '<td><div class="thumb" style="background-image: url(/img/sample.jpg);"></div></td>';
                    html += '<td class="name">' + data.d_name + '</td>';
                    html += '<td>' + data.d_keyword + '</td>';
                    html += '<td>' + data.d_created_date.split(' ')[0] + '</td>';
                html += '</tr>';

            } else if (dataType == 'product') {
                html += '<tr id="' + data.p_id + '" data_type="' + dataType + '">';
                    html += '<td>' + data.p_id + '</td>';
                    html += '<td><div class="thumb" style="background-image: url(/img/sample.jpg);"></div></td>';
                    html += '<td class="name">' + data.p_name + '</td>';
                    html += '<td>' + data.p_keyword + '</td>';
                    html += '<td>' + data.p_created_date.split(' ')[0] + '</td>';
                html += '</tr>';

            } else if (dataType == 'tag') {
                html += '<tr id="' + data.t_id + '" data_type="' + dataType + '">';
                    html += '<td>' + data.t_id + '</td>';
                    html += '<td class="name">' + data.t_name + '</td>';
                    html += '<td>' + data.t_keyword + '</td>';
                    html += '<td>' + data.t_created_date.split(' ')[0] + '</td>';
                html += '</tr>';

            } else if (dataType == 'nutrient') {
                html += '<tr id="' + data.n_id + '" data_type="' + dataType + '">';
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

        // let tbodyDataList = document.querySelector('.js-tbody-data-list');
        tbodyDataList.innerHTML = html;

    });

}


function data() {

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

}
data();

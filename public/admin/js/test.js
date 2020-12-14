
const divTest = document.querySelector('.js-div-test');


function initTest() {

    // setBackgroundImage(divTest, '/admin/img/sample_test.png');

    // let url = getBackgroundImage(divTest);
    // alert(url);
    // removeBackGroundImage(divTest);

    createSpinner();
    setInterval(function() {
        removeSpinner();
    }, 2000);

}
initTest();

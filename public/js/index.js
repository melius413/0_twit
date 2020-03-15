const clog = console.log;

function joinSubmit(f) {
    if (f.email.value.trim() == "") {
        alert("이메일을 입력하세요.");
        f.email.focus();
        return false;
    }
    if (f.userpw.value.trim() == "") {
        alert("비밀번호를 입력하세요.");
        f.userpw.focus();
        return false;
    }
    if (f.username.value.trim() == "") {
        alert("이름(닉네임)을 입력하세요.");
        f.username.focus();
        return false;
    }
    return true;
}

function idChk(el) {
    // $(el)[0] -> vanilla el
    // let el = document.querySelector("body");
    // console.log(el);        // native DOM element (vanilla)
    // console.log($(el));     // jQuery
    // console.log($(el)[0]);  // native

    if (el.value.trim()) {
        // $.post('/users/idchk', { email: el.value.trim() }, function (res) {
        //     console.log(res);
        // }, function (xhr) {
        //     console.log(xhr);
        // });

        $.ajax({
            url: '/users/idchk',
            data: { email: el.value.trim() },
            type: "POST",
            dataType: "json",
            success: function (res) {
                console.log(res);
                $(el).next().empty();
                if (res.result) {
                    $(el).next().removeClass("text-danger")
                        .addClass("text-success")
                        .text("* 멋진 이메일입니다.");
                } else {
                    $(el).next().removeClass("text-succuess")
                        .addClass("text-danger")
                        .text("* 사용할수 없는 이메일입니다.");
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    } else { }
}

// 카카오 로그아웃 문제
// res.clearCookie(); // 카카오 로그아웃을 위해 쿠키까지 삭제필요?? 안됨
// Kakao.Auth.logout(); // 로그아웃을 위해서 카카오 API 직접호출 필요 또는
// https://developers.kakao.com/docs/restapi/user-management#%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83
// curl -v -X POST https://kapi.kakao.com/v1/user/logout \
// -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
// -H 는 헤더에 담에서 보내라
// beforeSend 사용필요

// 앱정보의 플랫폼 정보추가: 사이트 도메인 http://127.0.0.1:3000 추가필요
function kakaoLogout(token) {
    $.ajax({
        url: "https://kapi.kakao.com/v1/user/logout",
        type: "POST", // 포스트는 아래와 같이 헤더를 쓸수 있다.
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*'); // CORS policy
        },
        success: function (res) {
            console.log(res);
            location.href = "/users/logout";
        },
        error: function (xhr, status, error) {
            console.log(xhr, status, error);
            alert("카카오 로그아웃에 실패하였습니다.");
            //location.href = "/";
        }
    });
}
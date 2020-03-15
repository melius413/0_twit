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
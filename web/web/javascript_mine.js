function init() {
    noConnection = false; // Cad, on parlera avec le serveur
    env = new Object();
    env.msgs = new Set();
    env.authors = new Set();
    env.photo = "./web/default_profile.png";
    env.id_max = 0;
    env.id_min = 255;
    env.selected_twist = 0;
    env.on_display_user = -1;
}

// $(".twists-stream").appear();
// $(".twists-stream").on("appear", function (event, $affected) {
//     console.log("[APPEAR] = " + env.on_display_user + " | " + env.id_max + " | " + env.id_min);
//     refreshMessages(env.on_display_user, env.id_max, env.id_min);
// });

$(document).ready(function () {
    $(document).ajaxStart(function () {
        $("#loader").show();
    }).ajaxStop(function () {
        console.log("Hiding");
        $("#loader").hide();
    });
});

function msg(id, author, name, lastname, author_id, text, date, comments) {
    console.log('msg function');
    this.id = id;
    this.author = author;
    this.name = name;
    this.lastname = lastname;
    this.author_id = author_id;
    var env_author = {"name": this.name, "lastname": this.lastname, "author": this.author};
    env.authors[author_id] = env_author;
    this.text = text;
    this.date_ = date;
    if (comments == undefined) {
        comments = [];
    }
    this.comments = comments;
    msg.prototype.getHtml = function () {
        var d = Date.now();
        var now = Math.floor((d - this.date_) / 60000);
        if (env.id == this.author_id) {
            remove_button = "<input class=\"remove_button_msg\" id=\"" + this.id + "\" type=\"submit\" value=\"Remove\" action=\"javascript:(function(){})()\" onclick=\"removeMessage(this.id)\">";
        }
        else {
            remove_button = "";
        }
        if ((now < 0) || (now == 0) || (isNaN(now))) {
            now = "Just now";
        } else {
            if ((now > 0) && (now < 60)) {
                now = now + "m";
            }
            if ((now >= 60) && (now < 1440)) {
                now = Math.floor((now/60)) + "h";
            } else if (now >= 1440) {
                now = Math.floor((now/60)/24) + "d";
            }
        }
        var msg_html =
            "<div class=\"twist\" id=\"" + this.id + "\">" +
            "   <div class=\"message-header\">" +
            "       <a class=\"username\" id=\"" + this.id + "\" action=\"javascript:(function(){})()\" onclick=\"getUserPanelFromMessages(this.id)\">" + this.name + " " + this.lastname + "</a>" +
            "       <small class=\"login\"> @" + this.author + "</small>" +
            "       <small class=\"time\"> " + now + "</small>" +
            remove_button +
            "   </div>" +
            "   <div class=\"message-content\">" +
            "       <p>" + this.text + "</p>" +
            "   </div>" +
            "   <input class=\"comments\" id=\"" + this.id + "\" value=\"View comments\" type=\"submit\" onclick=\"showComments(this.id, this.name, this.lastname, this.date_)\"/>" +
            "</div>";
        return msg_html;
    }
}

function comment(id, author, text, date, msg_id) {
    console.log('comment function');
    this.id = id;
    this.author = author;
    this.text = text;
    this.date = date;
    this.msg_id = msg_id;
    comment.prototype.getHtml = function () {
        var comment_html = "Hello"; // TODO: Comment html
        return comment_html;
    }
}

// TODO: Revival function, look up how it works and how to do it properly

function makeRegisterPanel() {
    console.log('Creating register html');
    var html =
        "<div class=\"wrapper-register\">" +
        "   <div class=\"register\">" +
        "       <h1>Register a new account</h1>" +
        "       <form class=\"register_form\" name=\"register_form\" onSubmit=\"register(this)\" action=\"javascript:(function(){})()\">" +
        "           <input type=\"text\" name=\"user_name\" placeholder=\"Name\">" +
        "           <input type=\"text\" name=\"user_lastname\" placeholder=\"Last Name\">" +
        "           <input type=\"text\" name=\"mail_register\" placeholder=\"Email\">" +
        "           <input type=\"text\" name=\"user_register\" placeholder=\"Username\">" +
        "           <input type=\"password\" name=\"user_password\" placeholder=\"Password\">" +
        "           <input type=\"password\" name=\"user_re_password\" placeholder=\"Type your password again\">" +
        "           <input type=\"submit\" placeholder=\"Connection\" class=\"register_submit\">" +
        "       </form>" +
        "       <div class=\"register-help\">" +
        "           <a href=\"#\">Forgot Password</a>" +
        "       </div>" +
        "   </div>" +
        "</div>";
    $("body").html(html);
    console.log("Register panel ready in body");
}

function register(f) {
    console.log('Testing register values client side');
    var name = document.register_form.user_name.value;
    var lastname = document.register_form.user_lastname.value;
    var login = document.register_form.user_register.value;
    var email = document.register_form.mail_register.value;
    var passwd = document.register_form.user_password.value;
    var re_passwd = document.register_form.user_re_password.value;
    if (testRegisterForm(name, lastname, login, email, passwd, re_passwd)) {
        registerConnection(name, lastname, login, email, passwd, re_passwd);
    }
}

function testRegisterForm(name, lastname, login, email, passwd, re_passwd) {
    result = false;
    if ((name.length <= 0) || (lastname.length <= 0) || (login.length <= 0)
        || (email.length <= 0) || (passwd.length <= 0) || (re_passwd.length <= 0)) {
        console.log('Error, one of the inputs is empty'); // TODO: End all the tests client-side
        errorRegisterForm("Error, one of the inputs is empty");
    } else {
        console.log('Register service accepted, sending to server');
        result = true;
    }
    return result;
}

function errorRegisterForm(errorMessage, code) {
    console.log("[ERROR] = " + code);
    var html =
        "<div id=\"errorRegister\" style=\"color: red;\">" +
        "   <p>" + errorMessage + "</p>" +
        "</div>";
    var oldMessage = $("errorRegister");
    if (oldMessage.length == 0) {
        $("form").prepend(html);
    } else {
        oldMessage.replaceWith(html);
    }
}

// TODO: Implement server-side receiving email and re_passwd
function registerConnection(name, lastname, login, email, passwd, re_passwd) {
    console.log('Adding new user server-side');
    $.ajax({
        type: "GET",
        url: "create",
        dataType: "json",
        data: "name=" + name + "&lastName=" + lastname + "&email=" + email + "&login=" + login + "&passwd=" + passwd,
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + "\n" + errorThrown);
        },
        success: function (rep) {
            console.log("Answer from server: " + rep);
            registerConnectionResponse(rep);
        }
    })
}

function registerConnectionResponse(rep) {
    console.log('Loading local variables from server response');
    console.log(rep);
    if (rep.error == undefined) {
        env.id = rep.id;
        env.key = rep.key;
        env.login = rep.login;
        env.name = rep.name;
        env.lastname = rep.lastname;
        env.follows = new Set();
        if (rep.f != undefined) {
            for (var i = 0; i < rep.f.length; i++) {
                env.follows.add(rep.f[i]);
            }
        }
        makeLoginPanel();
    } else {
        errorRegisterForm(rep.error, rep.code);
    }
}

function makeLoginPanel() {
    console.log('Creating login html');
    var html =
        "<div class=\"wrapper-login\">" +
        "   <div class=\"login\">" +
        "       <h1>Log into your account</h1>" +
        "       <form class=\"login-form\" name=\"login_form\" onSubmit=\"login(this)\" action=\"javascript:(function(){})()\">" +
        "           <input type=\"text\" name=\"user_login\" placeholder=\"Username\">" +
        "           <input type=\"password\" name=\"user_password\" placeholder=\"Password\">" +
        "           <input type=\"submit\" placeholder=\"Connection\" class=\"login-submit\">" +
        "       </form>" +
        "       <div class=\"login-help\">" +
        "           <a onclick=\"javascript:makeRegisterPanel()\">Register</a> - <a href=\"#\">Forgot Password</a>" +
        "       </div>" +
        "   </div>" +
        "</div>";
    $("body").html(html);
    console.log("Login panel ready in body");
}

function login(f) {
    var login = document.login_form.user_login.value;
    var passwd = document.login_form.user_password.value;
    if (testLoginForm(login, passwd)) {
        loginConnection(login, passwd);
    }
}

function testLoginForm(login, passwd) {
    result = false;
    if ((login.length == 0) || (passwd.length == 0)) {
        console.log('Error, one of the inputs is empty'); // TODO: End all the tests client-side
        errorLoginForm("Error, one of the inputs is empty");
    } else {
        console.log("Login accepted, sending to server");
        result = true;
    }
    return result;
}

function errorLoginForm(errorMessage, code) {
    console.log("[ERROR] = " + code);
    var html =
        "<div id=\"errorLogin\" style=\"color: red;\">" +
        "   <p>" + errorMessage + "</p>" +
        "</div>";
    var oldMessage = $("errorLogin");
    if (oldMessage.length == 0) {
        $("form").prepend(html);
    } else {
        oldMessage.replaceWith(html);
    }
}

function loginConnection(login, passwd) {
    $.ajax({
        type: "GET",
        url: "login",
        dataType: "json",
        data: "user=" + login + "&passwd=" + passwd,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR:\n" + JSON.stringify(jqXHR));
            console.log("AJAX Error: " + textStatus + ":" + errorThrown);
        },
        success: function (rep) {
            loginConnectionResponse(rep);
        }
    });
}

function loginConnectionResponse(rep) {
    console.log("Handling Login response");
    if (rep.error == undefined) {
        console.log("No error, setting environnement variables");
        env.id = rep.id;
        env.key = rep.key;
        env.login = rep.login;
        env.name = rep.name;
        env.lastname = rep.lastname;
        env.follows = new Set();
        if (rep.f != undefined) {
            for (var i = 0; i < rep.f.length; i++) {
                env.follows.add(rep.f[i]);
            }
        }
        makeMainPanel();
    } else {
        errorLoginForm(rep.error, rep.code);
    }
}

function makeMainPanel() {
    console.log("Now, we should make the main panel :)");
    if (env.login == "jruiz") {
        env.photo = "./web/0ZfOasx5_bigger.jpg";
    }
    var html =
        "<header>" +
        "   <div class=\"wrapper\">" +
        "       <a class=\"logo\" action=\"javascript:(function(){})()\" >" +
        "           <img onclick=\"javascript:getInitialMessages()\" src=\"./web/logo.png\" alt=\"Twister_logo\" class=\"logo\">" +
        "       </a>" +
        "       <input id=\"search\" type=\"text\" name=\"Search\" placeholder=\"Search Twister...\"/>" +
        "       <input id=\"logout\" type=\"submit\" value=\"logout\" onclick=\"javascript:logout()\"/>" +
        "   </div>" +
        "</header>" +
        "   <div class=\"wrapper-content\" id=\"page-container\">" +
        "       <div class=\"dashboard-left\">" +
        "           <div class=\"profile-card\">" +
        "               <a class=\"dashboard-left-image\" action=\"javascript:(function(){})()\">" +
        "                   <img class=\"dashboard-left-image\" src=\"" + env.photo + "\" id=\"" + env.id + "\" onclick=\"getUserPanel(this.id)\">" +
        "               </a>" +
        "               <div class=\"dashboard-left-user-info\">" +
        "                   <a class=\"user-name\" action=\"javascript:(function(){})()\" id=\"" + env.id + "\"onclick=\"getUserPanel(this.id)\">" + env.name + " " + env.lastname + "</a>" +
        "                   <span class=\"user-login\">@" + env.login + "</span>" +
        "               </div>" +
        "           </div>" +
        "       </div>" +
        "       <div class=\"main\">" +
        "           <div class=\"tweet-box\">" +
        "               <h1 class=\"post-twist\">Post your Twist!</h1>" +
        "               <p>" +
        "                   <form name=\"new_twist_form\" action=\"javascript:(function(){})()\" onsubmit=\"newTwist()\">" +
        "                       <textarea name=\"new_twist_text\" class=\"tweet-text\" placeholder=\"What's happening?\"></textarea>" +
        "                       <input class=\"new_tweet\" type=\"submit\" value=\"Twist\">" +
        "                   </form>" +
        "               </p>" +
        "           </div>" +
        "           <div class=\"twists-stream\">" +

        "           <div class=\"loader\" id=\"loader\"></div>" +

        "           </div>" +
        "       </div>" +
        "       <div class=\"dashboard-right\">" +
        "           <div class=\"comments-stream\">" +
        "               <div class=\"comments-header\">" +
        "                   <h3>Comments: </h3>" +
        "                   <form name=\"new_comment_form\" class=\"add-comment\" id=\"message-for-comment-id\" action=\"javascript:(function(){})()\" onsubmit=\"newComment()\">" +
        "                       <textarea name=\"new_comment_text\" class=\"add-comment\" placeholder=\"Add your own!\" form=\"message-for-comment-id\"></textarea>" +
        "                       <input class=\"new-comment\" type=\"submit\" value=\"Comment on this twist!\">" +
        "                   </form>" +
        "               </div>" +
        "           <div class=\"twist-for-comment\" id=\"comment-twist\">" +

        "           </div>" +
        "       </div>" +
        "   </div>" +
        // "   <footer>" +
        // "       <div class=\"footer_wrapper\">" +
        // "          <p class=\"love\">Crafted with &hearts; by <a class=\"github_user\" href=\"https://github.com/javiruiz01\">Javier Ruiz Calle</a></p>" +
        // "       </div>" +
        // "   </footer>" +
        "</div>";
    $("body").html(html);
    getInitialMessages();
    console.log("Body is now the main panel.")
}

function logout() {
    $.ajax({
        type: "GET",
        url: "logout",
        dataType: "json",
        data: "key=" + env.key,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR:\n" + JSON.stringify(jqXHR));
            console.log("AJAX Error: " + textStatus + ":" + errorThrown);
        },
        success: function (rep) {
            logoutResponse(rep);
        }
    });
}

function logoutResponse(rep) {
    console.log("Handling logout");
    if (rep.error == undefined) {
        console.log("No error, returning to login screen");
        makeLoginPanel();
    } else {
        errorLogout(rep.error, rep.code);
    }
}

function errorLogout(message, code) {
    console.log("[ERROR] = " + code + ", " + message);
}

function getInitialMessages() {
    console.log("[GET INITIAL MESSAGES] -> " + "key=" + env.key + "&from=-1&id_max=-1&id_min=-1&nb=10");
    $.ajax({
        type: "GET",
        url: "messages",
        dataType: "json",
        data: "key=" + env.key + "&from=-1&id_max=-1&id_min=-1&nb=10",
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR:\n" + JSON.stringify(jqXHR));
            console.log("AJAX Error: " + textStatus + ":" + errorThrown);
        },
        success: function (rep) {
            getInitialMessagesResponse(rep);
        }
    });
}

function getInitialMessagesResponse(rep) {
    console.log("Testing for errors in response from server with the messages");
    if (rep.error == undefined) {
        console.log("No apparent errors, setting up messages");
        var html = '';
        for (var i = 0; i < rep.length; i++) {
            var obj = rep[i];
            console.log("OBJ.MESSAGE_ID = " + obj.message_id);
            if (obj.message_id == undefined) {
                continue; // TODO: Erase this when all the messages have ids
            }
            if (parseInt(obj.message_id) > env.id_max) {
                env.id_max = obj.message_id;
            }
            if (parseInt(obj.message_id) < env.id_min) {
                env.id_min = obj.message_id;
            }
            if (obj.comments != undefined) {
                env.msgs[obj.message_id] = new msg(obj.message_id, obj.author,
                    obj.name, obj.lastname, obj.author_id, obj.text, obj.date, obj.comments);
                html += env.msgs[obj.message_id].getHtml();
            } else {
                env.msgs[obj.message_id] = new msg(obj.message_id, obj.author,
                    obj.name, obj.lastname, obj.author_id, obj.text, obj.date);
                html += env.msgs[obj.message_id].getHtml();
            }
        }
        console.log("Printing messages");
        // var old_messages = $(".twists-stream");
        // if (old_messages.length == 0) {
        //     $(".twists-stream").html(html);
        // } else {
        //     $(".twists-stream").append(html);
        // }
        $(".twists-stream").html(html);
        console.log("Messages available");
    }
}

function newTwist() {
    console.log("Testing new message values");
    var text = document.new_twist_form.new_twist_text.value;
    if (text.length > 140) {
        newTwistFormError("Twist is too long.");
    }
    newTwistConnection(text);
}

function newTwistFormError(message) {
    console.log(message);
    console.log("[ERROR] = " + code);
    var html =
        "<div id=\"newTwistError\" style=\"color: red;\">" +
        "   <p>" + message + "</p>" +
        "</div>";
    var oldMessage = $("errorRegister");
    if (oldMessage.length == 0) {
        $(".twists_stream").prepend(html);
    } else {
        oldMessage.replaceWith(html);
    }
}

function newTwistConnection(text) {
    console.log("Attempting to post new message");
    $(".tweet-text").val('');
    $.ajax({
        type: "GET",
        url: "addmessage",
        dataType: "json",
        data: "key=" + env.key + "&text=" + text,
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + "\n" + errorThrown);
        },
        success: function (rep) {
            console.log("Answer from server: " + rep);
            newTwistResponse(rep);
        }
    })
}

function newTwistResponse(rep) {
    console.log("Handling response from server");
    if (rep.error == undefined) {
        env.id_max = rep.message_id;
        makeMainPanel();
        refreshMessages("-1", env.id_max, env.id_min);
    }
}

function refreshMessages(from, id_max, id_min) {
    console.log("[REFRESH MESSAGES] -> " + "key=" + env.key + "&from=" + from + "&id_max=" + id_max + "&id_min=" + id_min + "&nb=10");
    $.ajax({
        type: "GET",
        url: "messages",
        dataType: "json",
        data: "key=" + env.key + "&from=" + from + "&id_max=" + id_max + "&id_min=" + id_min + "&nb=10",
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR:\n" + JSON.stringify(jqXHR));
            console.log("AJAX Error: " + textStatus + ":" + errorThrown);
        },
        success: function (rep) {
            getInitialMessagesResponse(rep);
        }
    });
}

function showComments(twist_id, name, lastname, date) {
    env.selected_twist = twist_id;
    console.log("Printing comments.");
    var d = Date.now();
    console.log("Date now = " + d);
    var now = Math.floor((d - parseInt(env.msgs[twist_id].date_)) / 60000);
    if ((now < 0) || (now == 0) || (isNaN(now))) {
        now = "Just now";
    } else {
        if ((now > 0) && (now < 60)) {
            now = now + "m";
        }
        if ((now >= 60) && (now < 1440)) {
            now = Math.floor((now/60)) + "h";
        } else if (now >= 1440) {
            now = Math.floor((now/60)/24) + "d";
        }
    }
    var html_twist =
        "<div class=\"message-header\">" +
        "   <a class=\"username\" action=\"javascript:(function(){})()\" id=\"" + env.selected_twist + "\" onclick=\"getUserPanelFromMessages(this.id)\">" + env.msgs[env.selected_twist].author + "</a>" +
        "   <small class=\"time\"> " + now + "</small>" +
        "</div>" +
        "<div class=\"message-content\">" +
        "   <p>" + env.msgs[twist_id].text + "</p>" +
        "</div>";
    console.log("Fetching comments from environment");
    for (var i = 0; i < env.msgs[twist_id].comments.length; i++) {
        d = Date.now();
        now = Math.floor((d - parseInt(env.msgs[twist_id].comments[i].date)) / 60000);
        if ((now < 0) || (now == 0) || (isNaN(now))) {
            now = "Just now";
        } else {
            if ((now > 0) && (now < 60)) {
                now = now + "m";
            }
            if ((now >= 60) && (now < 1440)) {
                now = Math.floor((now/60)) + "h";
            } else if (now >= 1440) {
                now = Math.floor((now/60)/24) + "d";
            }
        }
        html_twist +=
            "<div class=\"comment\" id=\"comment" + env.msgs[twist_id].comments[i].id + "\">" +
            "   <div class=\"message-header\">" +
            "       <a class=\"comment-username\" id=\"" + env.msgs[twist_id].comments[i].author_id + "\" action=\"javascript:(function(){})()\" onclick=\"getUserPanel(this.id)\"> @" + env.msgs[twist_id].comments[i].author + "</a>" +
            "       <small class=\"time\"> " + now + "</small>" +
            "   </div>" +
            "   <div class=\"comment-content\">" +
            "       <p>" + env.msgs[twist_id].comments[i].text + "</p>" +
            "   </div>" +
            "</div>";
    }

    $(".twist-for-comment").html(html_twist);
}

function newComment() {
    var text = document.new_comment_form.new_comment_text.value;
    if (text.length > 140) {
        newCommentError("Comment is too long");
    }
    newCommentConnection(text);
}

function newCommentError(message) {
    console.log(message);
    console.log("[ERROR] = " + code);
    var html =
        "<div id=\"newCommentError\" style=\"color: red;\">" +
        "   <p>" + message + "</p>" +
        "</div>";
    var oldMessage = $("errorComment");
    if (oldMessage.length == 0) {
        $(".comments_stream").prepend(html);
    } else {
        oldMessage.replaceWith(html);
    }
}

function newCommentConnection(text) {
    console.log("Sending comment info to server");
    $(".add-comment").val('');
    $.ajax({
        type: "GET",
        url: "addcomment",
        dataType: "json",
        data: "key=" + env.key + "&text=" + text + "&message_id=" + parseInt(env.selected_twist),
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ERROR:\n" + JSON.stringify(jqXHR));
            console.log("AJAX Error: " + textStatus + ":" + errorThrown);
        },
        success: function (rep) {
            newCommentResponse(rep);
        }
    });
}

function newCommentResponse(rep) {
    console.log("Creating html for new comment");
    var d = new Date();
    var message_date = new Date(rep.date.toLocaleString());
    var minutes = d.getMinutes() - message_date;
    var html_comment =
        "<div class=\"comment\" id=\"comment" + env.selected_twist + "\">" +
        "   <div class=\"message-header\">" +
        "       <a class=\"comment-username\" href=\"...\"> @" + rep.author + "</a>" +
        "       <small class=\"time\"> " + minutes + "m</small>" +
        "   </div>" +
        "   <div class=\"comment-content\">" +
        "       <p>" + rep.text + "</p>" +
        "   </div>" +
        "</div>";
    env.msgs[env.selected_twist].comments.push(rep);
    $(".twist-for-comment").append(html_comment);
}

function getUserPanelFromMessages(id) {
    console.log("Creating user panel");
    if (env.msgs[id].author == "jruiz") {
        profile_photo = "./web/user.jpg";
    } else {
        profile_photo = "./web/default_profile.png";
    }

    if (env.msgs[parseInt(id)].author_id != env.id) {
        if (!env.follows.has(env.msgs[parseInt(id)].author_id)) {
            var html_button_follow =
                "               <div class=\"follow_user\">" +
                "                   <input class=\"follow_user_button\" id=\"" + env.msgs[parseInt(id)].author_id + "\" value=\"Follow\" onclick=\"follow(this.id)\" type=\"submit\">" +
                "               </div>";
        } else {
            var html_button_follow =
                "               <div class=\"follow_user\">" +
                "                   <input class=\"follow_user_button\" id=\"" + env.msgs[parseInt(id)].author_id + "\" value=\"Unfollow\" onclick=\"unfollow(this.id)\" type=\"submit\">" +
                "               </div>";
        }
    } else {
        html_button_follow = "";
    }

    var html =
        "<header>" +
        "   <div class=\"wrapper\">" +
        "       <a class=\"logo\" action=\"javascript:(function(){})()\" >" +
        "           <img onclick=\"javascript:makeMainPanel();getInitialMessages()\" src=\"./web/logo.png\" alt=\"Twister_logo\" class=\"logo\">" +
        "       </a>" +
        "       <input id=\"search\" type=\"text\" name=\"Search\" placeholder=\"Search Twister...\"/>" +
        "       <input id=\"logout\" type=\"submit\" value=\"logout\" onclick=\"javascript:logout()\"/>" +
        "   </div>" +
        "</header>" +
        "   <div class=\"wrapper-content\" id=\"page-container\">" +
        "       <div class=\"dashboard-left\">" +
        "           <div class=\"profile-card\">" +
        "               <a class=\"dashboard-left-image\" action=\"javascript:(function(){})()\">" +
        "                   <img class=\"dashboard-left-image\" id=\"" + env.msgs[id].author_id + "\"src=\"" + profile_photo + "\" onclick=\"getUserPanel(this.id)\">" +
        "               </a>" +
        "               <div class=\"dashboard-left-user-info\">" +
        "                   <a class=\"user-name\" action=\"javascript:(function(){})()\" onclick=\"getUserPanel(this)\">" + env.msgs[parseInt(id)].author + " " + env.msgs[parseInt(id)].lastname + "</a>" +
        "                   <span class=\"user-login\">@" + env.msgs[parseInt(id)].author + "</span>" +
        "               </div>" +
        html_button_follow +
        "           </div>" +
        "       </div>" +
        "       <div class=\"main\">" +
        "           <div class=\"tweet-box\">" +
        "               <h1 class=\"post-twist\">Post your Twist!</h1>" +
        "               <p>" +
        "                   <form name=\"new_twist_form\" action=\"javascript:(function(){})()\" onsubmit=\"newTwist()\">" +
        "                       <textarea name=\"new_twist_text\" class=\"tweet-text\" placeholder=\"What's happening?\"></textarea>" +
        "                       <input class=\"new_tweet\" type=\"submit\" value=\"Twist\">" +
        "                   </form>" +
        "               </p>" +
        "           </div>" +
        "           <div class=\"twists-stream\">" +

        "           <div class=\"loader\" id=\"loader\"></div>" +

        "           </div>" +
        "       </div>" +
        "       <div class=\"dashboard-right\">" +
        "           <div class=\"comments-stream\">" +
        "               <div class=\"comments-header\">" +
        "                   <h3>Comments: </h3>" +
        "                   <form name=\"new_comment_form\" class=\"add-comment\" id=\"message-for-comment-id\" action=\"javascript:(function(){})()\" onsubmit=\"newComment()\">" +
        "                       <textarea name=\"new_comment_text\" class=\"add-comment\" placeholder=\"Add your own!\" form=\"message-for-comment-id\"></textarea>" +
        "                       <input class=\"new-comment\" type=\"submit\" value=\"Comment on this twist!\">" +
        "                   </form>" +
        "               </div>" +
        "           <div class=\"twist-for-comment\" id=\"comment-twist\">" +

        "           </div>" +
        "       </div>" +
        "   </div>" +
        // "   <footer>" +
        // "       <div class=\"footer_wrapper\">" +
        // "          <p class=\"love\">Crafted with &hearts; by <a class=\"github_user\" href=\"https://github.com/javiruiz01\">Javier Ruiz Calle</a></p>" +
        // "       </div>" +
        // "   </footer>" +
        "</div>";
    $("body").html(html);
    console.log("[GET USER PANEL] -> key=" + env.key + "&from=" + env.msgs[id].author_id + "&id_max=" + "-1" + "&id_min=" + "-1&nb=10");
    refreshMessages(env.msgs[id].author_id, "-1", "-1");
}

function getUserPanel(author_id) {
    console.log("Setting up user panel for user number: " + author_id);
    if (author_id == "1") {
        profile_photo = "./web/user.jpg";
    } else {
        profile_photo = "./web/default_profile.png";
    }

    if (author_id != env.id) {
        if (!env.follows.has(author_id)) {
            var html_button_follow =
                "               <div class=\"follow_user\">" +
                "                   <input class=\"follow_user_button\" id=\"" + author_id + "\" value=\"Follow\" onclick=\"follow(this.id)\" type=\"submit\">" +
                "               </div>";
        } else {
            var html_button_follow =
                "               <div class=\"follow_user\">" +
                "                   <input class=\"follow_user_button\" id=\"" + author_id + "\" value=\"Unfollow\" onclick=\"unfollow(this.id)\" type=\"submit\">" +
                "               </div>";
        }
    } else {
        html_button_follow = "";
    }

    var html =
        "<header>" +
        "   <div class=\"wrapper\">" +
        "       <a class=\"logo\" action=\"javascript:(function(){})()\" >" +
        "           <img onclick=\"javascript:makeMainPanel();getInitialMessages()\" src=\"./web/logo.png\" alt=\"Twister_logo\" class=\"logo\">" +
        "       </a>" +
        "       <input id=\"search\" type=\"text\" name=\"Search\" placeholder=\"Search Twister...\"/>" +
        "       <input id=\"logout\" type=\"submit\" value=\"logout\" onclick=\"javascript:logout()\"/>" +
        "   </div>" +
        "</header>" +
        "   <div class=\"wrapper-content\" id=\"page-container\">" +
        "       <div class=\"dashboard-left\">" +
        "           <div class=\"profile-card\">" +
        "               <a class=\"dashboard-left-image\" action=\"javascript:(function(){})()\">" +
        "                   <img class=\"dashboard-left-image\" id=\"" + author_id + "\"src=\"" + profile_photo + "\" onclick=\"getUserPanel(this.id)\">" +
        "               </a>" +
        "               <div class=\"dashboard-left-user-info\">" +
        "                   <a class=\"user-name\" action=\"javascript:(function(){})()\" id=\"" + author_id + "\" onclick=\"getUserPanel(this.id)\">" + env.authors[author_id].name + " " + env.authors[author_id].lastname + "</a>" +
        "                   <span class=\"user-login\" id=\"" + author_id + "\">@" + env.authors[author_id].author + "</span>" +
        "               </div>" +
        html_button_follow +
        "           </div>" +
        "       </div>" +
        "       <div class=\"main\">" +
        "           <div class=\"tweet-box\">" +
        "               <h1 class=\"post-twist\">Post your Twist!</h1>" +
        "               <p>" +
        "                   <form name=\"new_twist_form\" action=\"javascript:(function(){})()\" onsubmit=\"newTwist()\">" +
        "                       <textarea name=\"new_twist_text\" class=\"tweet-text\" placeholder=\"What's happening?\"></textarea>" +
        "                       <input class=\"new_tweet\" type=\"submit\" value=\"Twist\">" +
        "                   </form>" +
        "               </p>" +
        "           </div>" +
        "           <div class=\"twists-stream\">" +

        "           <div class=\"loader\" id=\"loader\"></div>" +

        "           </div>" +
        "       </div>" +
        "       <div class=\"dashboard-right\">" +
        "           <div class=\"comments-stream\">" +
        "               <div class=\"comments-header\">" +
        "                   <h3>Comments: </h3>" +
        "                   <form name=\"new_comment_form\" class=\"add-comment\" id=\"message-for-comment-id\" action=\"javascript:(function(){})()\" onsubmit=\"newComment()\">" +
        "                       <textarea name=\"new_comment_text\" class=\"add-comment\" placeholder=\"Add your own!\" form=\"message-for-comment-id\"></textarea>" +
        "                       <input class=\"new-comment\" type=\"submit\" value=\"Comment on this twist!\">" +
        "                   </form>" +
        "               </div>" +
        "           <div class=\"twist-for-comment\" id=\"comment-twist\">" +

        "           </div>" +
        "       </div>" +
        "   </div>" +
        // "   <footer>" +
        // "       <div class=\"footer_wrapper\">" +
        // "          <p class=\"love\">Crafted with &hearts; by <a class=\"github_user\" href=\"https://github.com/javiruiz01\">Javier Ruiz Calle</a></p>" +
        // "       </div>" +
        // "   </footer>" +
        "</div>";
    $("body").html(html);
    console.log("[GET USER PANEL] -> key=" + env.key + "&from=" + author_id + "&id_max=" + "-1" + "&id_min=" + "-1&nb=10");
    refreshMessages(author_id, "-1", "-1");
}

function follow(author_id) {
    console.log("[FOLLOW] = " + "key=" + env.key + "&to=" + author_id);
    console.log("Following user with id = " + author_id);
    author = env.authors[author_id].author
    $.ajax({
        type: "GET",
        url: "addfriend",
        dataType: "json",
        data: "key=" + env.key + "&to=" + author,
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + "\n" + errorThrown);
        },
        success: function (rep) {
            followResponse(rep, author_id);
        }
    });
}

function followResponse(rep, author_id) {
    console.log("Response from server received");
    console.log(rep)
    if (rep.error == undefined) {
        console.log("Attempting to change buttons value");
        env.follows.add(author_id);
        getUserPanel(author_id);
    }
}

function unfollow(author_id) {
    console.log("[UNFOLLOW] = " + "key=" + env.key + "&to=" + author_id);
    console.log("Unfollowing user with id = " + author_id);
    author = env.authors[author_id].author
    $.ajax({
        type: "GET",
        url: "remove",
        dataType: "json",
        data: "key=" + env.key + "&to=" + author,
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + "\n" + errorThrown);
        },
        success: function (rep) {
            unfollowResponse(rep, author_id);
        }
    });
}
function unfollowResponse(rep, author_id) {
    console.log("Response from server received: ");
    console.log(rep);
    if (rep.error == undefined) {
        console.log("Attempting to change buttons value");
        console.log("Deleting from env.follows the user with id = " + author_id);
        env.follows.delete(author_id);
        getUserPanel(author_id);
    }
}

function removeMessage(message_id) {
    console.log("Attempting to remove message with id = " + message_id);
    $.ajax({
        type: "GET",
        url: "removemessage",
        dataType: "json",
        data: "key=" + env.key + "&id=" + message_id,
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + "\n" + errorThrown);
        },
        success: function (rep) {
            removeMessageResponse(rep, message_id);
        }
    });
}

function removeMessageResponse(rep, message_id) {
    console.log("Attempting to read response");
    console.log(rep);
    if (rep.error == undefined) {
        env.msgs.delete(message_id);
        makeMainPanel();
    }
}

/*APPEAR*/
// $(window).scroll(function() {
//     if($(window).scrollTop() + $(window).height() == $(document).height()) {
//         console.log("Scroll function");
//         refreshMessages(env.on_display_user, env.id_max, env.id_min);
//     }
// });

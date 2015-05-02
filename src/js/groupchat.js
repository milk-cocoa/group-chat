(function(){
    var milkcocoa = new MilkCocoa("readi93m3gfd.mlkcca.com");
    var auth0 = new Auth0({
        domain:       'milkcocoa.auth0.com',
        clientID:     'hfkROMu3xWxFPYCtF4w8oNMf8MrPhchT',
        //callbackURL:  '{YOUR APP URL}',
        callbackOnLocationHash: true
    });

    var current_topic = {
        id : ""
    }
	var current_user = {
		id : "",
		name : ""
	}

    var global = {};

    function Util() {

    }

    Util.escapeHTML = function(val) {
        return $('<div>').text(val).html();f
    }

	function getMessageDataStore(topic_id) {
		return topicDataStore.child(topic_id);
	}

    var app = new Vue({
        el: '#content',
        data: {
            currentView: null
        }
    });
    init_login(app, milkcocoa, auth0, function(err, user) {
        app.currentView = "topics";
        current_user.id = user.sub;
    });
    init_register(app, milkcocoa, auth0);
    init_topics(app, milkcocoa, {
        global : global,
        current_user : current_user,
        onSelectTopic : function(err, topic) {
            current_topic.id = topic.id;
            current_topic.owner_id = topic.owner_id;
            current_topic.title = topic.title;            
        }
    });
    init_chat(app, milkcocoa, {
        global : global,
        current_topic : current_topic,
        current_user : current_user
    });
    init_account(app, milkcocoa, {
        current_user : current_user
    });
    init_invite(app, milkcocoa, {
        current_user : current_user,
        current_topic : current_topic
    });




    milkcocoa.user(function(err, user) {
        if(user) {
            current_user.id = user.sub;
            var userDataStore = milkcocoa.dataStore("user").child(current_user.id);
            userDataStore.get("info", function(err, info) {
                current_user.name = info.value.email;
                current_user.email = info.value.email;
                hashchange();
            });
        }else{
            app.currentView = "login";
        }
    });

	function hashchange() {
		var hash = location.hash.substr(1);
        if(hash) {
            if(hash == "account") app.currentView = "account";
            else {
                var hashes = hash.split("/");
                current_topic.owner_id = hashes[0];
                current_topic.id = hashes[1];
                if(hashes[2] == "invite") {
                    app.currentView = "invite";
                }else{
                    app.currentView = "chat";
                }
            }
        }else{
            app.currentView = "topics";
        }
	}

	window.onhashchange = function() {
		hashchange();
	}

    global.Util = Util;

}())
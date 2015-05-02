(function(){
	function init(app, milkcocoa, auth0) {
	    Vue.component('register', {
	        template: "#register-template",
	        data : {
	                email : "",
	                password : "",
	                confirm : ""
	        },
	        methods : {
	            register : function() {
	                var self = this;
	                if(this.password != this.confirm) return;
	                    auth0.signup({
	                    	connection: 'devices',
	                    	username:   this.email,
	                    	password:   this.password
	                    }, function (err, user, id_token) {
	                    	milkcocoa.authWithToken(id_token, function(err, milkcocoa_user){
	                    		if(err) {
	                    			self.message = err;
	                    			return;
	                    		}
								var email2userDataStore = milkcocoa.dataStore("email2user");
		                    	email2userDataStore.set(user.email, {
		                    		user_id : user.user_id
		                    	});
		                    	var userDataStore = milkcocoa.dataStore("user").child(user.user_id);
		                    	userDataStore.set("info", {
		                    		email : user.email
		                    	});
		                    	console.log(user.user_id, user.email);
		                        app.currentView = "login";
	                    	});
	                    });
	            },
	            goto_login_view : function() {
	                app.currentView = "login";
	            }
	        }
	    });
	}
	window.init_register = init;
}())

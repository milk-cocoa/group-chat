(function(){
	function init(app, milkcocoa, auth0, onSuccess) {
	    Vue.component('login', {
	        template: "#login-template",
	        data : {
	                email : "",
	                password : ""
	        },
	        methods : {
	            login : function() {
	                var self = this;
	                    auth0.login({
	                    	connection: 'devices',
	                    	username:   this.email,
	                    	password:   this.password
	                    }, function (err, profile, id_token, access_token) {
	                    	if(err) {
	                    		self.message = err.details.error_description;
	                    		return;
	                    	}
	                    	milkcocoa.authWithToken(id_token, function(err, user){
							    milkcocoa.user(function(err, user) {
							    	if(err) {
							    		throw new Error("login failued");
							    		return;
							    	}
		                    		console.log(user);
			                        onSuccess(null, user);
							    });
	                    	});
	                    });
	            },
	            goto_reg_view : function() {
	                app.currentView = "register";
	            }
	        }
	    });	
	}
	window.init_login = init;
}())
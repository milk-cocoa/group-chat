(function(){
	function init(app, milkcocoa) {
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
	                milkcocoa.addAccount(this.email, this.password, {}, function(err, user) {
	                    if(err == MilkCocoa.Error.AddAccount.FormatError) {
	                        self.message = "フォーマットエラー";
	                    }else if(err == MilkCocoa.Error.AddAccount.AlreadyExist) {
	                        self.message = "Emailアドレスが既に使われています。";
	                    }else{
							var email2userDataStore = milkcocoa.dataStore("email2user");
	                    	email2userDataStore.set(self.email, {
	                    		user_id : user.id
	                    	});
	                        app.currentView = "login";
	                    }
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

(function(){
	function init(app, milkcocoa, onSuccess) {
	    Vue.component('login', {
	        template: "#login-template",
	        data : {
	                email : "",
	                password : ""
	        },
	        methods : {
	            login : function() {
	                var self = this;
	                milkcocoa.login(this.email, this.password, function(err, user) {
	                    if(err == MilkCocoa.Error.Login.FormatError) {
	                        self.message = "フォーマットエラー";
	                    }else if(err == MilkCocoa.Error.Login.LoginError) {
	                        self.message = "Emailかパスワードが違います。";
	                    }else if(err == MilkCocoa.Error.Login.EmailNotVerificated) {
	                        self.message = "メールを確認してください。";
	                    }else{
	                        onSuccess(null, user);
	                        //location.reload();
	                    }
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
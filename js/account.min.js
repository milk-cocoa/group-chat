(function(){
	function init(app, milkcocoa, option) {
		var usernameDataStore = milkcocoa.dataStore("username");
	    Vue.component('account', {
	        template: "#account-template",
	        data : {
	        	username : ""
	        },
	        ready : function() {
	        	this.fetch();
	        },
	        methods : {
	            fetch : function() {
	            	var self = this;
	            	usernameDataStore.get(option.current_user.id, function(e) {
	            		self.username = e.username;
	            	});
	            },
	            update : function() {
	            	var self = this;
	            	usernameDataStore.set(option.current_user.id, {
	            		username : self.username
	            	});
	            }
	        }
	    });
	}
	window.init_account = init;
}())

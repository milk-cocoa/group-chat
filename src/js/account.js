(function(){
	function init(app, milkcocoa, option) {
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
					var userDataStore = milkcocoa.dataStore("user").child(option.current_user.id);
	            	userDataStore.get("info", function(e) {
	            		self.username = e.username;
	            	});
	            },
	            update : function() {
	            	var self = this;
					var userDataStore = milkcocoa.dataStore("user").child(option.current_user.id);
	            	userDataStore.set("info", {
	            		username : self.username
	            	});
	            }
	        }
	    });
	}
	window.init_account = init;
}())

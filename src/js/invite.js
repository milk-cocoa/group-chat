(function(){
	function init(app, milkcocoa, option) {
		var userDataStore = milkcocoa.dataStore("user");
	    Vue.component('invite', {
	        template: "#invite-template",
	        data : {
	        	allow_users : [],
	        	invited_user_email : ""
	        },
	        ready : function() {
	        	this.fetch();
	        },
	        methods : {
	            fetch : function() {
	            	var self = this;
					var topic_id = option.current_topic.id;
					var user_id = option.current_user.id;

					var allowDataStore = milkcocoa.dataStore("topics").child(user_id).child(topic_id).child("allow");
					allowDataStore.query({}).done(function(allow_users) {
						self.allow_users = allow_users.map(function(u) {return {
							email : u.id
						}})
					});
					allowDataStore.on("set", function(e) {
						self.allow_users.push({
							email : e.id
						})
					})
	            },
	            invite : function() {
	            	var self = this;
					var topic_id = option.current_topic.id;
					var topic_title = option.current_topic.title;
					var user_id = option.current_user.id;

					var allowDataStore = milkcocoa.dataStore("topics").child(user_id).child(topic_id).child("allow");
					allowDataStore.set(self.invited_user_email, {
						email : self.invited_user_email
					});
					userDataStore.get(self.invited_user_email, function(invited_user) {
						var userTopicsDataStore = milkcocoa.dataStore("user").child(invited_user.user_id).child("topics");
						userTopicsDataStore.set(topic_id , {
							topic_id : topic_id,
							owner_id : user_id,
							title : topic_title
						});
					});
	            }
	        }
	    });
	}
	window.init_invite = init;
}())

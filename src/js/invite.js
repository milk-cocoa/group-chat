(function(){
	function init(app, milkcocoa, option) {
		var email2userDataStore = milkcocoa.dataStore("email2user");
	    Vue.component('invite', {
	        template: "#invite-template",
	        data : {
	        	topic_link : "",
	        	title : "",
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
					var owner_id = option.current_topic.owner_id;
					var user_id = option.current_user.id;
					self.topic_link = "#" + owner_id + "/" + topic_id;

					var topicDataStore = milkcocoa.dataStore("topics").child(owner_id);
	                topicDataStore.get(topic_id, function(err, topic) {
	                	if(err) {
	                		console.error("トピック情報がありません。");
	                		return;
	                	}
	                	self.title = topic.value.title;
	                    window.document.title = self.title + " 設定"
	                });

					var allowDataStore = milkcocoa.dataStore("topics").child(user_id).child(topic_id).child("allow");
					allowDataStore.stream().size(30).next(function(err, allow_users) {
						console.log(allow_users);
						self.allow_users = allow_users.map(function(u) {
							return {
								id : u.id,
								email : u.value.email
							}
						});
					});
					allowDataStore.off("set");
					allowDataStore.on("set", function(u) {
						self.allow_users.push({
							id : u.id,
							email : u.value.email
						})
					})
	            },
	            invite : function() {
	            	var self = this;
					var topic_id = option.current_topic.id;
					var user_id = option.current_user.id;

					var allowDataStore = milkcocoa.dataStore("topics").child(user_id).child(topic_id).child("allow");
					email2userDataStore.get(self.invited_user_email, function(err, invited_user) {
						var invited_user_id = invited_user.value.user_id;
						console.log(invited_user);
						allowDataStore.set(invited_user_id, {
							email : self.invited_user_email
						});
						var userTopicsDataStore = milkcocoa.dataStore("user").child(invited_user_id).child("topics");
						userTopicsDataStore.set(topic_id , {
							topic_id : topic_id,
							owner_id : user_id,
							title : self.title
						});
					});
	            },
	            remove_user : function(user_id) {
	            	var self = this;
					var topic_id = option.current_topic.id;
					var user_id = option.current_user.id;

					var allowDataStore = milkcocoa.dataStore("topics").child(user_id).child(topic_id).child("allow");
					allowDataStore.remove(user_id);
					for(var i=0;i < self.allow_users.length;i++) {
						if(self.allow_users[i].id == user_id) {
							self.allow_users.splice(i, 1);
							break;
						}
					}
	            }
	        }
	    });
	}
	window.init_invite = init;
}())

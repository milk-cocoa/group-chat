(function(){
	function init(app, milkcocoa, option) {
		var global = option.global;
		var current_user = option.current_user;
	    Vue.component('topics', {
	        template: "#topics-template",
	        data : {
	        	topics : [],
	        	new_topic : ""
	        },
	        filters : {
	        	topics_filter : function(topics) {
	        		return topics;
	        	}
	        },
	        ready : function() {
	        	this.fetch();
	        },
	        methods : {
	            fetch : function() {
	            	var self = this;
					var userTopicsDataStore = milkcocoa.dataStore("user").child(current_user.id).child("topics");
	            	userTopicsDataStore.on("push", function(e) {
	            		self.topics.unshift({
	            			topic_id : e.value.topic_id,
	            			owner_id : e.value.owner_id,
	            			title : global.Util.escapeHTML(e.value.title)
	            		});
	            	});
	            	userTopicsDataStore.stream().sort("desc").size(20).next(function(err, topics) {
	            		if(topics) {
		            		self.topics = topics.map(function(t) {
		            			return {
			            			topic_id : t.value.topic_id,
			            			owner_id : t.value.owner_id,
		            				title : t.value.title == "" ? "トピック名が設定されていません" : global.Util.escapeHTML(t.value.title)
		            			}
		            		}).reverse();
	            		}
	            	});
                		console.log("aaa");

					var topicDataStore = milkcocoa.dataStore("topics").child(current_user.id);
                	topicDataStore.on('push', function(e) {
                		console.log(e);
                    	var new_topic_id = e.id;
						var allowDataStore = milkcocoa.dataStore("topics").child(current_user.id).child(new_topic_id).child("allow");
						allowDataStore.set(current_user.id, {
							email : current_user.email
						});
						var userTopicsDataStore = milkcocoa.dataStore("user").child(current_user.id).child("topics");
						userTopicsDataStore.push({
							topic_id : new_topic_id,
							owner_id : current_user.id,
							title : e.value.title
						});
                	});

	            },
	            logout : function() {
	            	milkcocoa.logout();
	            },
	            create : function() {
                		console.log(current_user.id);
					var topicDataStore = milkcocoa.dataStore("topics").child(current_user.id);
	                if(this.new_topic) {
	                    topicDataStore.push({
	                        title : global.Util.escapeHTML(this.new_topic),
	                        user : current_user
	                    });
	                    this.new_topic = "";
	                }
	            },
	            goto_chatroom : function(topic_id, owner_id) {
	            	option.onSelectTopic(null, {
	            		id : topic_id,
	            		owner_id : owner_id,
	            		title : this.topics.filter(function(n) {return n.topic_id == topic_id})[0].title
	            	});
	            	location.hash = global.Util.escapeHTML(owner_id) + "/" + global.Util.escapeHTML(topic_id);
	            	app.currentView = "chat";
	            }
	        }
	    });
    }
	window.init_topics = init;
}())

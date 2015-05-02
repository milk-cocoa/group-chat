(function(){
	function init(app, milkcocoa, option) {
		var global = option.global;
	    return Vue.component('chat', {
	        template: "#chat-template",
	        data : {
	        	invite_link : "",
	        	title : "",
	            messages : [],
	            new_message : ""
	        },
	        filters: {
	            messages_filter : function(messages) {
	            	return messages.map(function(message) {
	            		return {
	            			content : global.Util.escapeHTML(message.value.content),
	            			username : global.Util.escapeHTML(message.value.user.name)
	            		}
	            	})
	            }
	        },
	        ready : function() {
	            this.fetch();
	        },
	        methods : {
	            post : function() {
	                if(this.new_message) {
						var topic_id = option.current_topic.id;
						var owner_id = option.current_topic.owner_id;
						var topicDataStore = milkcocoa.dataStore("topics").child(owner_id);
						var messageDataStore = topicDataStore.child(topic_id);
	                    messageDataStore.push({
	                        content : global.Util.escapeHTML(this.new_message),
	                        user : option.current_user,
	                        timestamp : new Date().getTime()
	                    });
	                    this.new_message = "";
	                }
	            },
	            fetch : function() {
	                var self = this;
					var topic_id = option.current_topic.id;
					var owner_id = option.current_topic.owner_id;
					self.invite_link = "#" + owner_id + "/" + topic_id + "/invite";
					var topicDataStore = milkcocoa.dataStore("topics").child(owner_id);
					var messageDataStore = topicDataStore.child(topic_id);
	                topicDataStore.get(topic_id, function(err, topic) {
	                	if(err) {
	                		return;
	                	}
	                	self.title = topic.value.title;
	                    window.document.title = self.title;
	                });
	                messageDataStore.off("push");
	                messageDataStore.on("push", function(pushed) {
	                	self.messages.unshift(pushed);
	                });
	                messageDataStore.stream().sort('desc').size(20).next(function(err, memos) {
	                	if(err) {
	                		console.error("Permission Denied");
	                		return;
	                	}
	                    self.messages = memos;
	                });
	            }
	        }
	    });
	}
	window.init_chat = init;
}())

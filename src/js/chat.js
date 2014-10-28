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
	            message_filter : function(messages) {
	            	return messages;
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
	                topicDataStore.get(topic_id, function(topic) {
	                	self.title = topic.title;
	                    window.document.title = self.title;
	                });
	                messageDataStore.off("push");
	                messageDataStore.on("push", function(e) {
	                	self.messages.unshift({
	                		content : global.Util.escapeHTML(e.value.content),
	                		user : {
	                			name : global.Util.escapeHTML(e.value.user.name)
	                		}
	                	});
	                });
	                messageDataStore.query().sort('desc').limit(20).done(function(memos) {
	                    self.messages = memos;
	                });
	            }
	        }
	    });
	}
	window.init_chat = init;
}())

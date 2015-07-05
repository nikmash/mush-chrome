require("popup.css")
var React = require("react/addons")
var Login = require("login.jsx")
var Mention = require("mention.jsx")
var Axios = require("axios")

Axios.interceptors.request.use(function(config) {
	config.url = "http://api.ironbay.digital/" + config.url;
	return config;
});

function setSession(session) {
	Axios.interceptors.request.use(function(config) {
		config.params = config.params || {};
		config.params.session = session;
		return config;
	});
}

var root = React.createClass({
	getInitialState: function() {
		return {
			authenticated : undefined 
		};
	},
	componentWillMount: function() {
		var self = this
		chrome.storage.local.get(null, function(result) {
			var session = result.session;
			Axios.get("me?session=" + session).then(function(response) {
				setSession(session)
				self.setState({
					authenticated : true,
					session : session,
				})

			}).catch(function() {
				self.setState({
					authenticated : false,
				})

			})
		})
	},
	login : function(email, password) {
		Axios.post("auth/login", {email : email, password : password}).then(function(response) {
			var session = response.data.payload;
			chrome.storage.local.set({session : session})
			chrome.runtime.sendMessage({ type : "login"})
			setSession(session)
			this.setState({
				session : session,
				authenticated : true 
			});
		}.bind(this))
	},
	render: function() {
		if(this.state.authenticated == undefined)
			return false;
		if(!this.state.authenticated)
			return <Login login={this.login} />
		return (
			<Mention auth={this.state} />
		);
	}

});

module.exports = root;
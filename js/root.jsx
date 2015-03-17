require("popup.css")
var React = require("react/addons")
var Login = require("login.jsx")
var Mention = require("mention.jsx")
var Qwest = require("qwest")
console.log(Qwest)

var root = React.createClass({
	getInitialState: function() {
		return {
			authenticated : undefined 
		};
	},
	componentWillMount: function() {
		var session = localStorage.getItem("session")
		this.setState({
			authenticated: session != null,
			session : session
		});		
	},
	login : function(email, password) {
		Qwest.post("http://mush.io/api/auth/login", {Email : email, Password : password}, {dataType : "json"}).then(function(session) {
			localStorage.setItem("session", session)
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
var React = require('react');

var login = React.createClass({
	login : function() {
		this.props.login(this.refs.email.getDOMNode().value, this.refs.password.getDOMNode().value)
	},
	render: function() {
		return (
			<section className="login">
				<div className="logo">
				</div>
				<form>
					<input ref="email" placeholder="Email" />
					<input onKeyPress={this.handleKeyPress} ref="password" placeholder="Password" type="password" />
					<div className="button" onClick={this.login} >Login</div>
				</form>
			</section>
		);
	},
	handleKeyPress: function(e) {
		if (e.which === 13) {
			this.login()
		}
	}

});

module.exports = login;
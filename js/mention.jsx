var React = require('react');
var Axios = require("axios")

var mention = React.createClass({
	getInitialState: function() {
		return {
			friends:[], 
			link : false
		};
	},
	componentWillMount: function() {
		chrome.tabs.getSelected(null, function(tab) {
		    Axios.post("link", {
		        url : tab.url,
		    }).then(function(response) {
		    	this.setState({
		    		link : response.data.payload.link.id
		    	});

				Axios.get("link/" + this.state.link + "/tagged").then(function(response) {
					this.setState({
						friends : response.data.payload
					});

				}.bind(this)).catch(function() {
				})

		    }.bind(this))
		}.bind(this));
		
	},
	toggle : function(item) {
		item.checked = !item.checked;
		this.forceUpdate();
	},
	send: function(f) {
		var payload = this.state.friends
			.filter(function(item) {
				return item.checked
			})
			.map(function(item) {
				return item.friend.id
			})
		Axios.post("link/" + this.state.link + "/tag", payload).then(function() {
			window.close()
		})
	},
	render: function() {
		if(this.state.friends.length == 0)
			return false
		return (
			<section className="mention">
				<header>Tag Friends</header>
				<ul>
				{
					this.state.friends.map(function(item) {
						var cx = React.addons.classSet({
							active : item.checked
						})
						if(item.tagged) return;
						return (
							<li className={cx}>
								<a onClick={this.toggle.bind(this, item)}>
									<img src={item.friend.image} />
									<summary>
										<h1>{item.friend.name}</h1>
										<h2>{item.friend.email}</h2>
									</summary>
									<i></i>
								</a>
							</li>
						)
					}.bind(this))
				}
				</ul>
				<footer onClick={this.send}>Done</footer>
			</section>
		);
	}

});

module.exports = mention;

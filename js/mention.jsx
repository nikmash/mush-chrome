var React = require('react');
var Qwest = require("qwest")

var mention = React.createClass({
	getInitialState: function() {
		return {
			friends:[], 
			feed:false
		};
	},
	componentWillMount: function() {
		chrome.tabs.getSelected(null, function(tab) {
		    Qwest.post("http://mush.io/api/me/post?session=" + this.props.auth.session, {
		        url : tab.url,
		        caption : ""
		    }, {dataType : "json"}).then(function(feed) {
		    	this.setState({
		    		feed : JSON.parse(feed)
		    	});

				Qwest.get("http://mush.io/api/me/friends?session=" + this.props.auth.session, {dataType : "json"}).then(function(friends) {
					this.setState({
						friends : JSON.parse(friends)
					});

				}.bind(this)).catch(function() {
					console.log(arguments)
				})

		    }.bind(this))
		}.bind(this));
		
	},
	toggle : function(f) {
		f.mentioned = !f.mentioned;
		this.forceUpdate();
		Qwest.post("http://mush.io/api/me/friends/" + f.id + (f.mentioned ? "/mention/" : "/unmention/") + this.state.feed.post.id  + "?session=" + this.props.auth.session, {dataType : "json"}).then(function(friends) {
			this.forceUpdate();
		}.bind(this))
	},
	render: function() {
		return (
			<section className="mention">
				<header>Tag Friends</header>
				<ul>
				{
					this.state.friends.map(function(f) {
						var cx = React.addons.classSet({
							active : f.mentioned
						})
						return (
							<li className={cx}>
								<a onClick={this.toggle.bind(this, f)}>
									<img src={f.avatar} />
									<summary>
										<h1>{f.name}</h1>
										<h2>{f.email}</h2>
									</summary>
									<i></i>
								</a>
							</li>
						)

					}.bind(this))
				}
				</ul>
			</section>
		);
	}

});

module.exports = mention;
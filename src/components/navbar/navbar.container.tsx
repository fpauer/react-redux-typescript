import * as React from 'react';
import AuthHelper from '../auth/helpers/auth.helper';
import {Link} from 'react-router';

class Navbar extends React.Component<any, {}> {

	logout(event) {
		event.preventDefault();
		AuthHelper.logout();
	}

	componentDidMount() {
		window['jQuery']('.navbar').foundation();
	}

	render() {
		return (
			<div className="navbar">
				<div className="left">
					<ul className="dropdown menu icon-top" data-dropdown-menu data-click-open="true">
						<li>
							<Link to="/">
								<i className="fa fa-user"></i>
								<span>My Profile</span>
							</Link>
						</li>
						<li>
							<Link to="/">
								<i className="fa fa-comments"></i>
								<span>Messages</span>
							</Link>
						</li>
						<li>
							<a onClick={(event) => event.preventDefault()}>
								<i className="fa fa-ellipsis-h"></i>
								<span>More</span>
							</a>
							<ul className="menu">
								<li onClick={this.logout} onTouchEnd={this.logout}>
									<a className="trigger">Logout</a>
								</li>
							</ul>
						</li>

						{/*{this.props.user.isAdmin ? <li><Link to="users">Users</Link></li> : ''}*/}
					</ul>
				</div>
			</div>
		);
	}
}

export default Navbar;
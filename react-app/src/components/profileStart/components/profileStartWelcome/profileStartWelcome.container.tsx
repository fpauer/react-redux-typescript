import * as React from 'react';

class ProfileStartWelcome extends React.Component<any, any> {

	render() {
		return (
			<div className="profile-start-welcome">


				<div className="title">
					Thank You!
				</div>

				<div className="description">
					<p>
						<b>You have successfully created your free GPROSPlus&trade; account</b>. Please continue by building your practice’s profile and choosing the plan that is right for your business. Our goal is to provide you with the opportunity to “Practice Your Passion” and leave the rest to us.
					</p>
					<p>
						Please be as detailed as you can with your profile. The information and keywords you provide will help consumers find your business. If you wish to offer specials or discounts, please feel free to do as these consumers will be your new customers and sources for new referrals.
					</p>
					<p>
						One of our customer relationship representatives will reach out to you shortly to set up your personal business dashboard. This will provide you with real-time customer data so you never miss a GPROSPlus&trade; customer who has contacted you.
					</p>
					<p>
						If you have any questions please call 844-487-4776 or email info@gprosplus.com.
					</p>
				</div>

				<div className="proceed">
					<button className="button" type="button" onClick={this.props.navigateNextStep}>
						Continue
					</button>
				</div>

			</div>
		);
	}
}

export default ProfileStartWelcome;
import * as React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';
//import * as ProfileSpecialDiscounts from './profileSpecialDiscounts.container';


class ProfileSpecialDiscounts extends React.Component<any, any> {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log('mounted');
    }

    render() {
        return (
            <div>My test</div>
        );
    }

}


describe('<ProfileSpecialDiscounts />', () => {

    const mockOnInfoGathered = () => console.log('worked!');

    it('calls componentDidMount', () => {
        sinon.spy(ProfileSpecialDiscounts.prototype, 'componentWillMount');
        const wrapper = mount(<ProfileSpecialDiscounts onInfoGathered={mockOnInfoGathered} />);
        //expect(ProfileSpecialDiscounts.prototype.componentWillMount.calledOnce).to.equal(true);
    });

});
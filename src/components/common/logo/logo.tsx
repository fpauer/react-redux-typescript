import * as React from 'react';
import {LogoPropsInterface} from "./interfaces/logoProps.interface";

export default class Logo extends React.Component<LogoPropsInterface, any> {

    public static defaultProps: LogoPropsInterface = {
        image: 'logo.png'
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="logo">
                <img src={require('../../../assets/images/'+this.props.image)} />
            </div>
        );
    }
}
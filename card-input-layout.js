import React from 'react';
import {
    View,
    Text,
    TextInput
} from 'react-native';

export class CardInputLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {__number__:'',__exp_mm__:'',__exp_yy__:'',__cvv__:''};
    }

    render() {
        this.props.children.forEach((child) => {
            console.log('Children: ');
        });

        return (<View><Text>Layout</Text></View>);
    }
}
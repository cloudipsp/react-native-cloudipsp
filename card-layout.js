import React from 'react';
import {
    View,
    Text,
    TextInput
} from 'react-native';

import {Card} from './cloudipsp';

import CardInputNumber from './card-field-number';
import CardInputExpMm from './card-field-exp-mm';
import CardInputExpYy from './card-field-exp-yy';
import CardInputCvv from './card-field-cvv';

function getComponentName(component) {
    if (component.type.displayName != undefined) {
        return component.type.displayName;
    }
    return component.type.name;
}

export default class CardLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    getCard = () => {
        const cardNumber = this.inputNumber._getText();
        const expMm = this.inputExpMm._getText();
        const expYy = this.inputExpYy._getText();
        const expCvv = this.inputCvv._getText();

        const card = new Card();
        card.__getCardNumber__ = () => {
            return cardNumber;
        };
        card.__getExpYy__ = () => {
            try {
                return Number(expYy);
            } catch (e) {
                return 0;
            }
        };
        card.__getExpMm__ = () => {
            try {
                return Number(expMm);
            } catch (e) {
                return 0;
            }
        };
        card.__getCvv__ = () => {
            return expCvv;
        };

        return card;
    }

    test = () => {
        this.inputNumber._setText('4444555566661111');
        this.inputExpMm._setText('12');
        this.inputExpYy._setText('18');
        this.inputCvv._setText('111');
    }

    componentDidMount = () => {
        this.inputNumber = this.findOne(this, CardInputNumber);
        this.inputExpMm = this.findOne(this, CardInputExpMm);
        this.inputExpYy = this.findOne(this, CardInputExpYy);
        this.inputCvv = this.findOne(this, CardInputCvv);
    }

    render() {
        return (
            <View style={this.props.containerStyle}>
                {this.props.children}
            </View>);
    }

    findOne = (root, component) => {
        const componentName = component.getInputName();
        const array = [];
        this.find(root, componentName, array);
        if (array.length == 0) {
            throw new Error(this.constructor.name + ' should contains ' + componentName);
        }
        if (array.length > 1) {
            throw new Error(this.constructor.name + ' should contains only one view ' + componentName+'. '+
                'Now here '+array.length +' instances of '+componentName+'.');
        }
        return array[0];
    }

    find = (root, componentName, array) => {
        if (root.props != undefined && Array.isArray(root.props.children)) {
            root.props.children.forEach((child) => {
                const childName = getComponentName(child);
                if (childName == componentName) {
                    array.push(child._owner._instance.refs[child.ref]);
                    //may not always work.
                    //here should be better way to get view instance in rendering tree.
                }
                this.find(child, componentName, array);
            });
        }
    }
}
// @flow
import React from 'react';
import {
  AppRegistry,
  ScrollView,
  Text,
  TextInput,
  View,
  Button,
  Picker,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView
} from 'react-native';

import {
  Currency,
  Order,
  Receipt,
  Failure,
  Cloudipsp,
  CardInput,
  CardLayout,
  CardFieldNumber,
  CardFieldExpMm,
  CardFieldExpYy,
  CardFieldCvv,
  CloudipspWebView
} from 'react-native-cloudipsp';


class ExampleApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      merchant: '1396424',
      amount: '1',
      ccy: 'UAH',
      email: 'example@test.com',
      description: 'test payment :)',
      mode: 'entry'
    };
  }


  componentDidMount() {
    Cloudipsp.supportsApplePay()
      .then((result) => {
        console.log('SupportsApplePay: ', result);
      });
    Cloudipsp.supportsGooglePay()
      .then((result) => {
        console.log('SupportsGooglePay: ', result);
      });
  }

  getOrder = () => {
    return new Order(
      Number(this.state.amount),
      this.state.ccy,
      'rn_' + Math.random(),
      this.state.description,
      this.state.email
    );
  };

  pay = () => {
    const order = this.getOrder();
    const card = this.cardForm.getCard();
    if (!card.isValidCardNumber()) {
      Alert.alert('Warning', 'Credit card number is not valid');
    } else if (!card.isValidExpireMonth()) {
      Alert.alert('Warning', 'Expire month is not valid');
    } else if (!card.isValidExpireYear()) {
      Alert.alert('Warning', 'Expire year is not valid');
    } else if (!card.isValidExpireDate()) {
      Alert.alert('Warning', 'Expire date is not valid');
    } else if (!card.isValidCvv()) {
      Alert.alert('Warning', 'CVV is not valid');
    } else {
      const cloudipsp = this.cloudipsp();
      cloudipsp.pay(card, order)
        .then((receipt) => {
          this.setState({ webView: undefined });
          Alert.alert('Transaction Completed :)', 'Result: ' + receipt.status + '\nPaymentId: ' + receipt.paymentId);
          console.log('Receipt: ', receipt);
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
    }
  };

  cloudipsp = () => {
    return new Cloudipsp(Number(this.state.merchant), (payConfirmator) => {
      this.setState({ webView: 1 });
      return payConfirmator(this.cloudipspWebView);
    });
  };

  applePay = () => {
    const cloudipsp = this.cloudipsp();
    const order = this.getOrder();
    cloudipsp.applePay(order)
      .then((receipt) => {
        this.setState({ webView: undefined });
        Alert.alert('Transaction Completed :)', 'Result: ' + receipt.status + '\nPaymentId: ' + receipt.paymentId);
        console.log('Receipt: ', receipt);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  googlePay = () => {
    const cloudipsp = this.cloudipsp();
    const order = this.getOrder();
    cloudipsp.googlePay(order)
      .then((receipt) => {
        this.setState({ webView: undefined });
        Alert.alert('Transaction Completed :)', 'Result: ' + receipt.status + '\nPaymentId: ' + receipt.paymentId);
        console.log('Receipt: ', receipt);
      })
      .catch((error) => {
        console.log('Error: ', error);
        Alert.alert('Transaction Failure :(', 'Result: ' + error);
      });
  };

  render() {
    return <SafeAreaView style={styles.flex1}>
      {this.state.webView === undefined
        ? this.renderScreen()
        : <CloudipspWebView
          ref={(ref) => {
            this.cloudipspWebView = ref;
          }}
          decelerationRate="normal"
          onError={(error) => {
            console.log('webViewError:' + JSON.stringify(error));
          }}
          style={{ flex: 1 }}
        />
      }
    </SafeAreaView>
  }


  renderScreen() {
    if (this.state.mode === 'entry') {
      return this.renderModes();
    } else {
      return (<ScrollView
        style={styles.flex1}
        keyboardDismissMode={'none'}
        keyboardShouldPersistTaps={'always'}
      >
        <View
          style={{ padding: 20, flex: 1 }}>
          <TouchableOpacity onPress={() => {
            this.setState({ mode: 'entry' });
          }}>
            <Text style={styles.simpleText}>{'< Modes'}</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.simpleText}>Merchant:</Text>
          </View>
          <TextInput
            value={this.state.merchant}
            keyboardType='numeric'
            onChangeText={(text) => {
              this.setState({ merchant: text });
            }}
            onSubmitEditing={(event) => {
              this.refs.inputAmount.focus();
            }}
            style={styles.simpleTextInput}
          />
          <View style={{ marginTop: 20 }}>
            <Text style={styles.simpleText}>Amount:</Text>
          </View>
          <TextInput
            ref="inputAmount"
            value={this.state.amount}
            maxLength={7}
            keyboardType='numeric'
            onChangeText={(text) => {
              this.setState({ amount: text });
            }}
            onSubmitEditing={(event) => {
              this.refs.inputEmail.focus();
            }}
            style={styles.simpleTextInput}
          />
          <Text style={styles.simpleText}>Currency:</Text>
          <Picker
            selectedValue={this.state.ccy}
            onValueChange={(value) => {
              this.setState({ ccy: value });
            }}>

            <Picker.Item label="UAH" value="UAH"/>
            <Picker.Item label="USD" value="USD"/>
            <Picker.Item label="EUR" value="EUR"/>
            <Picker.Item label="GBP" value="GBP"/>
            <Picker.Item label="RUB" value="RUB"/>
            <Picker.Item label="KZT" value="KZT"/>
          </Picker>
          <Text style={styles.simpleText}>Email:</Text>
          <TextInput
            ref="inputEmail"
            value={this.state.email}
            keyboardType='email-address'
            onChangeText={(text) => {
              this.setState({ email: text });
            }}
            onSubmitEditing={(event) => {
              this.refs.inputDescription.focus();
            }}
            style={styles.simpleTextInput}
          />
          <Text style={styles.simpleText}>Description:</Text>
          <TextInput
            ref="inputDescription"
            value={this.state.description}
            onChangeText={(text) => {
              this.setState({ description: text });
            }}
            onSubmitEditing={(event) => {
              this.refs.cardInput.focus();
            }}
            style={styles.simpleTextInput}
          />
          {this.renderCardForm()}
          <View style={{ marginTop: 10, flexDirection: 'row' }}>
            <View style={styles.flex1}>
              <Button
                onPress={this.pay}
                title="Pay by Card"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              {
                Platform.OS === 'android'
                  ? <Button
                    onPress={this.googlePay}
                    title="Google Pay"
                  />
                  : <Button
                    onPress={this.applePay}
                    title="ApplePay"
                  />
              }
            </View>
          </View>
        </View>
      </ScrollView>);
    }
  }

  renderModes() {
    return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View>
        <Button
          onPress={() => {
            this.setState({ mode: 'default' });
          }}
          title="Default Example"
        />
        <View style={{ marginTop: 10 }}>
          <Button
            onPress={() => {
              this.setState({ mode: 'flexible' });
            }}
            title="Flexible Example"
          />
        </View>
      </View>
    </View>);
  }

  renderCardForm() {
    if (this.state.mode === 'default') {
      return (
        <View>
          <Text>Default card view</Text>

          <CardInput
            ref={(ref) => {
              this.cardForm = ref;
            }}
            debug={true}
            textStyle={styles.simpleText}
            textInputStyle={styles.simpleTextInput}
          />
        </View>);
    } else {
      return (
        <CardLayout
          ref={(ref) => {
            this.cardForm = ref;
          }}
          inputNumber={() => this.refs.inputNumber}
          inputExpMm={() => this.refs.inputMm}
          inputExpYy={() => this.refs.inputYy}
          inputCvv={() => this.refs.inputCvv}
        >
          <Text style={{ marginVertical: 20 }}>Card form layout. Cvv and expirity field were swapped</Text>
          <Text
            onPress={() => {
              this.refs.cardLayout.test();
            }}>
            Card Number:
          </Text>
          <CardFieldNumber
            ref="inputNumber"
            style={styles.simpleTextInput}
            onSubmitEditing={() => {
              this.refs.inputCvv.focus();
            }}
          />
          <Text style={[this.props.textStyle, { marginTop: 10 }]}>CVV:</Text>
          <CardFieldCvv
            ref="inputCvv"
            style={styles.simpleTextInput}
            onSubmitEditing={() => {
              this.refs.inputMm.focus();
            }}
          />
          <Text style={[this.props.textStyle, { marginTop: 10 }]}>Expiry:</Text>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <CardFieldExpMm
              ref="inputMm"
              style={[styles.flex1, styles.simpleTextInput]}
              placeholder='MM'
              onSubmitEditing={() => {
                this.refs.inputYy.focus();
              }}
            />
            <CardFieldExpYy
              ref="inputYy"
              style={[styles.flex1, styles.simpleTextInput]}
              placeholder='YY'
              onSubmitEditing={() => {
                if (this.props.onCompletion) {
                  this.props.onCompletion(this);
                }
              }}
            />
          </View>
        </CardLayout>);
    }
  }
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  buttonText: {
    textAlign: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#999999'
  },
  simpleTextInput: {
    height: 33,
    borderWidth: 0.5,
    borderColor: '#9900ff',
    flex: 1,
    fontSize: 17,
    padding: 6,
  },
  simpleText: {
    color: '#ff9900',
    fontSize: 16,
    padding: 4,
    marginTop: 5,
    marginBottom: 5
  }
});

AppRegistry.registerComponent('cloudipsp', () => ExampleApp);

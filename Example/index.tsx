import React from 'react';
import {
  AppRegistry,
  ScrollView,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView
} from 'react-native';

import {
  Card,
  CardFieldCvv,
  CardFieldExpMm,
  CardFieldExpYy,
  CardFieldNumber,
  CardInput,
  CardLayout,
  Cloudipsp,
  CloudipspWebView,
  Order,
} from 'react-native-cloudipsp';

import {Picker} from '@react-native-picker/picker'

type Mode = 'entry' | 'default' | 'flexible';

type State = {
  merchant: string;
  amount: string;
  ccy: string;
  email: string;
  description: string;
  mode: Mode;
  webView?: 1 | undefined;
};

class ExampleApp extends React.Component<unknown, State> {
  state: State = {
    merchant: '1396424',
    amount: '1',
    ccy: 'UAH',
    email: 'example@test.com',
    description: 'test payment :)',
    mode: 'entry'
  };
  private readonly _inputAmount = React.createRef<TextInput>();
  private readonly _inputEmail = React.createRef<TextInput>();
  private readonly _inputDescription = React.createRef<TextInput>();



  private readonly _cardInputRef = React.createRef<CardInput>();
  private readonly _cardLayoutRef = React.createRef<CardLayout>();
  private readonly _inputNumber = React.createRef<CardFieldNumber>();
  private readonly _inputExpMm = React.createRef<CardFieldExpMm>();
  private readonly _inputExpYy = React.createRef<CardFieldExpYy>();
  private readonly _inputCvv = React.createRef<CardFieldCvv>();
  private readonly _cloudipspWebView = React.createRef<CloudipspWebView>();

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

  private readonly _getOrder = () => {
    return new Order(
      Number(this.state.amount),
      this.state.ccy,
      'rn_' + Math.random(),
      this.state.description,
      this.state.email
    );
  };

  private readonly _pay = () => {
    let card: Card | null = null;

    if (this.state.mode === 'default') {
      card = this._cardInputRef.current?.getCard() ?? null;
    } else if (this.state.mode === 'flexible') {
      card = this._cardLayoutRef.current?.getCard() ?? null;
    }

    const order = this._getOrder();
    if (!card || !card.isValidCardNumber()) {
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
      const cloudipsp = this._cloudipsp();
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

  private readonly _cloudipsp = (): Cloudipsp => {
    return new Cloudipsp(Number(this.state.merchant), (payConfirmator) => {
      this.setState({ webView: 1 });
      return payConfirmator(this._cloudipspWebView.current!);
    });
  };

  applePay = () => {
    const cloudipsp = this._cloudipsp();
    const order = this._getOrder();
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
    const cloudipsp = this._cloudipsp();
    const order = this._getOrder();
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

  render(): React.ReactNode {
    return <SafeAreaView style={styles.flex1}>
      {this.state.webView === undefined
        ? this.renderScreen()
        : <CloudipspWebView ref={this._cloudipspWebView} />
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
            onSubmitEditing={() => {
              this._inputAmount.current?.focus();
            }}
            style={styles.simpleTextInput}
          />
          <View style={{ marginTop: 20 }}>
            <Text style={styles.simpleText}>Amount:</Text>
          </View>
          <TextInput
            ref={this._inputAmount}
            value={this.state.amount}
            maxLength={7}
            keyboardType='numeric'
            onChangeText={(text) => {
              this.setState({ amount: text });
            }}
            onSubmitEditing={() => {
              this._inputEmail.current?.focus();
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
            ref={this._inputEmail}
            value={this.state.email}
            keyboardType='email-address'
            onChangeText={(text) => {
              this.setState({ email: text });
            }}
            onSubmitEditing={() => {
              this._inputDescription.current?.focus();
            }}
            style={styles.simpleTextInput}
          />
          <Text style={styles.simpleText}>Description:</Text>
          <TextInput
            ref={this._inputDescription}
            value={this.state.description}
            onChangeText={(text) => {
              this.setState({ description: text });
            }}
            onSubmitEditing={() => {
              if (this.state.mode === 'default') {
                this._cardInputRef.current?.focus();
              } else {
                this._inputNumber.current?.focus();
              }
            }}
            style={styles.simpleTextInput}
          />
          {this.renderCardForm()}
          <View style={{ marginTop: 10, flexDirection: 'row' }}>
            <View style={styles.flex1}>
              <Button
                onPress={this._pay}
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

  private renderModes(): React.ReactNode {
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

  private renderCardForm(): React.ReactNode {
    if (this.state.mode === 'default') {
      return (
        <View>
          <Text>Default card view</Text>

          <CardInput
            ref={this._cardInputRef}
            debug={true}
            textStyle={styles.simpleText}
            textInputStyle={styles.simpleTextInput}
          />
        </View>);
    } else {
      return (
        <CardLayout
          ref={this._cardLayoutRef}
          inputNumber={() => this._inputNumber.current!}
          inputExpMm={() => this._inputExpMm.current!}
          inputExpYy={() => this._inputExpYy.current!}
          inputCvv={() => this._inputCvv.current!}
        >
          <Text style={{ marginVertical: 20 }}>Card form layout. Cvv and expirity field were swapped</Text>
          <Text
            onPress={() => {
              this._cardLayoutRef.current?.test();
            }}>
            Card Number:
          </Text>
          <CardFieldNumber
            ref={this._inputNumber}
            style={styles.simpleTextInput}
            onSubmitEditing={() => {
              this._inputCvv.current?.focus();
            }}
          />
          <Text style={{ marginTop: 10 }}>CVV:</Text>
          <CardFieldCvv
            ref={this._inputCvv}
            style={styles.simpleTextInput}
            onSubmitEditing={() => {
              this._inputExpMm.current?.focus();
            }}
          />
          <Text style={{marginTop: 10}}>Expiry:</Text>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <CardFieldExpMm
              ref={this._inputExpMm}
              style={[styles.flex1, styles.simpleTextInput]}
              placeholder='MM'
              onSubmitEditing={() => {
                this._inputExpYy.current?.focus();
              }}
            />
            <CardFieldExpYy
              ref={this._inputExpYy}
              style={[styles.flex1, styles.simpleTextInput]}
              placeholder='YY'
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

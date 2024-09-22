import React, {useState, useEffect, useRef} from 'react';
import {View, Button, Alert, Platform, SafeAreaView} from 'react-native';
import {Order, Cloudipsp, CloudipspWebView} from 'react-native-cloudipsp';

// Merchant ID for payment processing
const Merchant = 1396424;

const ApplePayGpay = () => {
    // State to manage the visibility of the WebView
    const [webView, setWebView] = useState(0);

    // Reference to the Cloudipsp WebView component
    const _cloudipspWebViewRef = useRef<CloudipspWebView>(null);

    // State to manage if the device supports Apple Pay or Google Pay
    const [supportedPayments, setSupportedPayments] = useState({
        applePay:false,
        googlePay:false
    });

    // Function to check if the device supports Apple Pay or Google Pay
    const isSupportingAppleOrGPay = async () => {
        const isIOS = Platform.OS === 'ios';

        // Check for Apple Pay support on iOS devices
        if (isIOS) {
            const supportsApplePay = await Cloudipsp.supportsApplePay();
            if (supportsApplePay) {
                setSupportedPayments({ ...supportedPayments,applePay:true });
                return;
            }
            Alert.alert('Apple Pay is not supported on this device');
        }

        // Check for Google Pay support on Android devices
        const supportsGooglePay = await Cloudipsp.supportsGooglePay();
        if (supportsGooglePay) {
            setSupportedPayments( { ...supportedPayments, googlePay: true } );
            return;
        }
        Alert.alert('Google Pay is not supported on this device');
    };

    // useEffect to run the payment support check when the component mounts
    useEffect(() => {
        isSupportingAppleOrGPay();
    }, []);

    // Function to initialize the Cloudipsp instance with the Merchant ID
    const _cloudipsp = (): Cloudipsp => {
        return new Cloudipsp(Merchant, (payConfirmator) => {
            setWebView(1); // Show the WebView for payment confirmation
            return payConfirmator(_cloudipspWebViewRef.current!);
        });
    };

    // Function to handle the Google Pay button press
    const handleGooglePayPress = async () => {

        const cloudipsp = _cloudipsp(); // Initialize the payment process with the merchant ID

        const order = new Order(  // Create an order object
            10, // Amount
            'GEL', // Currency
            'rn_' + Math.random(), // Unique order ID
            'test payment', // Description
            'test@gmail.com' // Customer email
        );

        try {
            // Process the Google Pay transaction and return the receipt
            const receipt = await cloudipsp.googlePay(order);
            setWebView(0); // Hide the WebView after payment processing
            console.log('Payment successful:', receipt);
        } catch (error) {
            // Handle payment errors
            console.error('Payment error:', error);
        }
    };



    // Function to handle the Google Pay button press
    const handleGooglePayPressWithToken = async () => {

        const cloudipsp = _cloudipsp(); // Initialize the payment process with the merchant ID

        try {
            // Process the Google Pay transaction and return the receipt
            const receipt = await cloudipsp.googlePayToken('59e582f09c17acad57ff2388b96ad775d44d8db4');
            setWebView(0); // Hide the WebView after payment processing
            console.log('Payment successful:', receipt);
        } catch (error) {
            // Handle payment errors
            console.error('Payment error:', error);
        }
    };

    // Function to handle the Apple Pay button press
    const handleApplePayPress = async () => {
        const cloudipsp = _cloudipsp(); // Initialize the payment process with the merchant ID
        const order = new Order(  // Create an order object
            100, // Amount
            'GEL', // Currency
            'rn_' + Math.random(), // Unique order ID
            'test payment', // Description
            'test@gmail.com' // Customer email
        );

        try {
            // Process the Apple Pay transaction and return the receipt
            const receipt = await cloudipsp.applePay(order);
            console.log('Payment successful:', receipt);
        } catch (error) {
            // Handle payment errors
            console.error('Payment error:', error);
        }
    };

    // Render the WebView if webView state is true
    if (webView) {
        return <View style={{flex:1,backgroundColor:'green'}}>
            <CloudipspWebView ref={_cloudipspWebViewRef} />
        </View>
    }

    // Render the main view with the Google Pay button if payment is supported
    return (
        <SafeAreaView>
            {supportedPayments.googlePay && (
                <Button title="Pay with Google Pay" onPress={handleGooglePayPress}/>
            )}
            {supportedPayments.applePay && (
                <Button title="Pay with Apple Pay" onPress={handleApplePayPress}/>
            )}
        </SafeAreaView>
    );
};

export default ApplePayGpay;

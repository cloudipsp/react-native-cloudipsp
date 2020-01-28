package com.cloudipsp.rn;


import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.util.Log;
import android.webkit.CookieManager;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.wallet.AutoResolveHelper;
import com.google.android.gms.wallet.CardInfo;
import com.google.android.gms.wallet.CardRequirements;
import com.google.android.gms.wallet.PaymentData;
import com.google.android.gms.wallet.PaymentDataRequest;
import com.google.android.gms.wallet.PaymentMethodTokenizationParameters;
import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.TransactionInfo;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.WalletConstants;

import java.math.BigDecimal;
import java.util.Arrays;

import javax.annotation.Nonnull;

public class RNCloudipspModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final int RC_GOOGLE_PAY = 41750;

    private Promise googlePayPromise;

    public RNCloudipspModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @Nonnull
    @Override
    public String getName() {
        return "RNCloudipsp";
    }

    private static boolean isGooglePayRuntimeProvided() {
        try {
            Class.forName("com.google.android.gms.common.GoogleApiAvailability");
            Class.forName("com.google.android.gms.wallet.PaymentDataRequest");
            return true;
        } catch (ClassNotFoundException e) {
            return false;
        }
    }

    @ReactMethod
    public void addCookies(String host, String cookie) {
        CookieManager.getInstance().setCookie(host, cookie);
    }

    @ReactMethod
    public void supportsGooglePay(Promise promise) {
        boolean result = false;
        if (isGooglePayRuntimeProvided()) {
            result = GoogleApiAvailability.getInstance()
                    .isGooglePlayServicesAvailable(getReactApplicationContext()) == ConnectionResult.SUCCESS;
        }
        promise.resolve(result);
    }

    @ReactMethod
    public void googlePay(ReadableMap config, int amount, String currency, Promise promise) {
        if (googlePayPromise != null) {
            promise.reject(new Exception("GooglePay already launched"));
        }
        googlePayPromise = promise;

        final ReadableMap allowedPaymentMethod = config
                .getArray("allowedPaymentMethods")
                .getMap(0);
        final ReadableMap tokenizationSpecification = allowedPaymentMethod.getMap("tokenizationSpecification");

        final PaymentDataRequest request = PaymentDataRequest.newBuilder()
                .setTransactionInfo(
                        TransactionInfo.newBuilder()
                                .setTotalPriceStatus(WalletConstants.TOTAL_PRICE_STATUS_FINAL)
                                .setTotalPrice(new BigDecimal(amount).setScale(2).toString())
                                .setCurrencyCode(currency)
                                .build())
                .addAllowedPaymentMethod(WalletConstants.PAYMENT_METHOD_CARD)
                .setCardRequirements(
                        CardRequirements.newBuilder()
                                .addAllowedCardNetworks(Arrays.asList(
                                        WalletConstants.CARD_NETWORK_VISA,
                                        WalletConstants.CARD_NETWORK_MASTERCARD))
                                .build())
                .setPaymentMethodTokenizationParameters(PaymentMethodTokenizationParameters.newBuilder()
                        .setPaymentMethodTokenizationType(
                                WalletConstants.PAYMENT_METHOD_TOKENIZATION_TYPE_PAYMENT_GATEWAY)
                        .addParameter("gatewayMerchantId", tokenizationSpecification.getMap("parameters").getString("gatewayMerchantId"))
                        .addParameter("gateway", tokenizationSpecification.getMap("parameters").getString("gateway"))
                        .build())
                .build();

        final Activity activity = getCurrentActivity();
        final PaymentsClient paymentsClient = Wallet.getPaymentsClient(activity,
                new Wallet.WalletOptions.Builder()
                        .setEnvironment(
                                config.getString("environment").equals("PRODUCTION")
                                        ? WalletConstants.ENVIRONMENT_PRODUCTION
                                        : WalletConstants.ENVIRONMENT_TEST
                        )
                        .build());
        AutoResolveHelper.resolveTask(
                paymentsClient.loadPaymentData(request),
                activity,
                RC_GOOGLE_PAY);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode != RC_GOOGLE_PAY) {
            return;
        }
        if (googlePayPromise == null) {
            return;
        }
        final Promise promise = googlePayPromise;
        googlePayPromise = null;

        if (resultCode == Activity.RESULT_CANCELED) {
            promise.reject(new Exception("CANCELED"));
        } else if (resultCode == Activity.RESULT_OK) {
            final PaymentData paymentData = PaymentData.getFromIntent(data);
            final WritableNativeMap result = new WritableNativeMap();
            final CardInfo cardInfo = paymentData.getCardInfo();
            result.putString("description", cardInfo.getCardDescription());
            result.putString("cardDetails", cardInfo.getCardDetails());
            result.putString("cardNetwork", cardInfo.getCardNetwork());
            result.putString("token", paymentData.getPaymentMethodToken().getToken());
            promise.resolve(result);
        } else {
            promise.reject(new Exception("ERROR"));
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}

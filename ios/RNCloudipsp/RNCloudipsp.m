#import <UIKit/UIKit.h>

#import "RNCloudipsp.h"
#import <React/RCTLog.h>
#import <PassKit/PassKit.h>

API_AVAILABLE(ios(11.0))
@interface RNCloudipsp () <PKPaymentAuthorizationViewControllerDelegate>

@property (nonatomic, strong) RCTPromiseResolveBlock applePayResolve;
@property (nonatomic, strong) RCTPromiseRejectBlock applePayRejecter;
@property (nonatomic, strong) RCTPromiseResolveBlock applePayCompleteResolver;
@property (nonatomic, strong) void (^applePayCallback)(PKPaymentAuthorizationResult *);

@end

@implementation RNCloudipsp

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(supportsApplePay:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    BOOL result = [PKPaymentAuthorizationViewController canMakePayments];
    resolve([NSNumber numberWithBool:result]);
}

RCT_EXPORT_METHOD(applePay:(NSDictionary *)config
                    amount:(NSInteger)amount
                  currency:(NSString *)currency
                     about:(NSString *)about
                   resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)rejecter)
{
    self.applePayResolve = resolve;
    self.applePayRejecter = rejecter;

    PKPaymentRequest *paymentRequest = [[PKPaymentRequest alloc] init];
    paymentRequest.countryCode = @"US";
    paymentRequest.supportedNetworks = @[PKPaymentNetworkVisa, PKPaymentNetworkMasterCard, PKPaymentNetworkAmex];
    paymentRequest.merchantCapabilities = PKMerchantCapability3DS;
    paymentRequest.merchantIdentifier = [config objectForKey:@"merchantIdentifier"];
    paymentRequest.currencyCode = currency;
    
    NSDecimalNumber *fixedAmount = [[NSDecimalNumber alloc] initWithMantissa:amount exponent:-2 isNegative:NO];
    PKPaymentSummaryItem *item = [PKPaymentSummaryItem summaryItemWithLabel:about amount:fixedAmount];
    paymentRequest.paymentSummaryItems = @[item];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        PKPaymentAuthorizationViewController *controller = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:paymentRequest];
        controller.delegate = self;
        UIViewController *topViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
        [topViewController presentViewController:controller animated:YES completion:nil];
    });
}

- (UIViewController *)topViewController{
    return [self topViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
}

- (UIViewController *)topViewController:(UIViewController *)rootViewController
{
    if (rootViewController.presentedViewController == nil) {
        return rootViewController;
    }
    
    if ([rootViewController.presentedViewController isKindOfClass:[UINavigationController class]]) {
        UINavigationController *navigationController = (UINavigationController *)rootViewController.presentedViewController;
        UIViewController *lastViewController = [[navigationController viewControllers] lastObject];
        return [self topViewController:lastViewController];
    }
    
    UIViewController *presentedViewController = (UIViewController *)rootViewController.presentedViewController;
    return [self topViewController:presentedViewController];
}

RCT_EXPORT_METHOD(applePayComplete:(BOOL)success
                           resolve:(RCTPromiseResolveBlock)resolve
                          rejecter:(RCTPromiseRejectBlock)rejecter)
{
    self.applePayCompleteResolver = resolve;
    dispatch_async(dispatch_get_main_queue(), ^{
        if (@available(iOS 11.0, *)) {
            if (success) {
                self.applePayCallback([[PKPaymentAuthorizationResult alloc] initWithStatus:PKPaymentAuthorizationStatusSuccess errors:nil]);
            } else {
                self.applePayCallback([[PKPaymentAuthorizationResult alloc] initWithStatus:PKPaymentAuthorizationStatusFailure errors:nil]);
            }
            self.applePayCallback = nil;
        }
    });
}

- (void)paymentAuthorizationViewControllerDidFinish:(PKPaymentAuthorizationViewController *)controller {
    [controller dismissViewControllerAnimated:YES completion:^{
        self.applePayCompleteResolver(nil);
        self.applePayCompleteResolver = nil;
    }];
}

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                   handler:(void (^)(PKPaymentAuthorizationResult *result))completion
API_AVAILABLE(ios(11.0))
{
    self.applePayCallback = completion;
    NSError *jsonError;
    
    NSDictionary *paymentData = [NSJSONSerialization JSONObjectWithData:payment.token.paymentData options:NSJSONReadingMutableContainers error:&jsonError];
    NSDictionary *paymentMethod = @{
                                    @"displayName":payment.token.paymentMethod.displayName,
                                    @"network":payment.token.paymentMethod.network,
                                    @"type": [RNCloudipsp paymentMethodName: payment.token.paymentMethod.type],
                                    };
    NSDictionary *paymentToken = @{
                                   @"paymentData": paymentData,
                                   @"paymentMethod": paymentMethod,
                                   @"transactionIdentifier": payment.token.transactionIdentifier
                                   };
    NSMutableDictionary *data = [NSMutableDictionary new];
    [data setObject:paymentToken forKey:@"token"];
    if (payment.shippingContact != nil) {
        NSDictionary *shipingContact = @{
                                         @"emailAddress": payment.shippingContact.emailAddress,
                                         @"familyName": payment.shippingContact.name.familyName,
                                         @"givenName": payment.shippingContact.name.givenName,
                                         @"phoneNumber": payment.shippingContact.phoneNumber.stringValue,
                                         };
        [data setObject:shipingContact forKey:@"shippingContact"];
    }
    self.applePayResolve(data);
    self.applePayResolve = nil;
    self.applePayRejecter = nil;
}

+ (NSString *)paymentMethodName:(PKPaymentMethodType)type API_AVAILABLE(ios(9.0)){
    switch (type) {
        case PKPaymentMethodTypeDebit:
            return @"debit";
        case PKPaymentMethodTypeCredit:
            return @"credit";
        case PKPaymentMethodTypePrepaid:
            return @"prepaid";
        case PKPaymentMethodTypeStore:
            return @"store";
        default:
            return @"unknown";
    }
}

@end

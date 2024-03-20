import { Component } from '@angular/core';
import { GooglePay } from '@fresha/capacitor-plugin-googlepay';
import { IsReadyToPayRequest, PaymentDataRequest } from '@fresha/capacitor-plugin-googlepay/dist/types';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  constructor() {}
  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  async initializeGooglePay() {
    try {
      const googlePay = GooglePay;
      await googlePay.initialize({
        environment: 'TEST',
      });
      const isReadyToPayRequest: IsReadyToPayRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['VISA', 'MASTERCARD','DISCOVER','AMEX'],
              billingAddressRequired: false
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'square',
                gatewayMerchantId: 'LMJWG38P7HC1B',
              },
            },
          },
        ],
        existingPaymentMethodRequired: true
      };
      const isReadyToPay = await googlePay.isReadyToPay(isReadyToPayRequest);
      if (isReadyToPay) {
        const paymentRequest: PaymentDataRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          merchantInfo: {
            merchantName: 'smartvalet.com',
          },
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['VISA', 'MASTERCARD','DISCOVER','AMEX'],
                billingAddressRequired: false
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: 'square',
                  gatewayMerchantId: 'LMJWG38P7HC1B',
                },
              },
            },
          ],
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPrice: '1000',
            currencyCode: 'COP',
          },
          
        };
        const paymentResponse = await googlePay.loadPaymentData(paymentRequest);
        if (paymentResponse) {
          const paymentToken = paymentResponse.paymentMethodData.tokenizationData.token;
          alert("pago exitoso" + paymentToken);
        } else {
          alert("error al efectuar el pago");
        }
      }
    } catch (error) {
      console.error('Error al inicializar Google Pay', error);
    }
  }
}

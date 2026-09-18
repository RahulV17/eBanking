package com.jsp.ebanking.util;

import java.math.BigDecimal;

import org.json.JSONObject;
import com.jsp.ebanking.dto.RazorpayDto;
import com.jsp.ebanking.exception.PaymentFailedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@Component
public class PaymentUtil {


	@Value("${razorpay.key}")
	private String key;
	@Value("${razorpay.secret}")
	private String secret;

	public RazorpayDto createOrder(BigDecimal amount) {
		try {
			RazorpayClient razorpay = new RazorpayClient(key, secret);
			JSONObject orderRequest = new JSONObject();
			orderRequest.put("amount", amount.multiply(new BigDecimal("100")).intValue());
			orderRequest.put("currency", "INR");
			Order order = razorpay.orders.create(orderRequest);
			return new RazorpayDto(order.get("id"), new BigDecimal(order.get("amount").toString()), key, "INR");
		} catch (RazorpayException e) {
			e.printStackTrace();
			throw new PaymentFailedException("Failed to Initialize Payment , We are Working Will fix ASAP");
		}

	}

	public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
		try {
			String payload = orderId + "|" + paymentId;
			return Utils.verifySignature(payload, signature, secret);
		} catch (RazorpayException e) {
			return false;
		}
	}

	/**
	 * SECURITY C1: fetches the amount directly from Razorpay's record of this
	 * order (in paise). Never trust amounts sent by the client.
	 * Returns null if the order cannot be fetched.
	 */
	public BigDecimal fetchOrderAmountInPaise(String orderId) {
		try {
			RazorpayClient razorpay = new RazorpayClient(key, secret);
			Order order = razorpay.orders.fetch(orderId);
			return new BigDecimal(order.get("amount").toString());
		} catch (RazorpayException e) {
			return null;
		}

	}

}

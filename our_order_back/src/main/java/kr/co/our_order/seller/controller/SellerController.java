package kr.co.our_order.seller.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.our_order.seller.model.service.SellerService;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/seller")
@Tag(name = "seller", description = "seller API")
public class SellerController {
	@Autowired
	private SellerService sellerService;
	
	
}

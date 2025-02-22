package kr.co.our_order.member.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import kr.co.our_order.member.model.dto.NaverLoginDTO;
import kr.co.our_order.member.model.service.MemberService;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/auth")
public class AuthController {
	@Autowired
	MemberService memberService;
	
	//Naver Login
    @PostMapping(value = "naverlogin")
    public ResponseEntity<Map<String, Object>> naverlogin(@RequestBody NaverLoginDTO naverLogin) {
        return memberService.processNaverLogin(naverLogin);  // 서비스 메서드 호출
    }

}

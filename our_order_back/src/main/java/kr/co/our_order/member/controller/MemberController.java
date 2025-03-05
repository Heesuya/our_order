package kr.co.our_order.member.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.our_order.member.model.dto.LoginMemberDTO;
import kr.co.our_order.member.model.dto.MemberDTO;
import kr.co.our_order.member.model.service.MemberService;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/member")
@Tag(name = "MEMBER", description = "MEMBER API")
public class MemberController {
	@Autowired
	private MemberService memberService;
	
	//join _ check-id
	@GetMapping(value="memberId/{memberId}/check-id")	
	public ResponseEntity<Integer> checkId(@PathVariable String memberId){
	System.out.println(memberId);
		int result = memberService.checkId(memberId);
		return ResponseEntity.ok(result);
	}
	
	//join _ check-email
	@GetMapping(value="memberEmail/{memberEmail}/check-email")
	public ResponseEntity<Integer> checkEmail(@PathVariable String memberEmail){
		int result = memberService.checkEmail(memberEmail);
		return ResponseEntity.ok(result);
	}
	
	//join _ signup
	@PostMapping(value="signup")
	public ResponseEntity<Integer> join(@RequestBody MemberDTO member) {//어제와 다르게 객체타입이 아닌 주고싶은 형태로 보낸다
		//MemberDTO result = member;
		//System.out.println("dd"+member);
		int result = memberService.insertMember(member);
		if(result > 0) {
			return ResponseEntity.ok(result);
		}else {
			return ResponseEntity.status(500).build();
		}
	}

	@PostMapping(value = "/refresh")
	public ResponseEntity<LoginMemberDTO> refresh(@RequestHeader("Authorization") String token){
		LoginMemberDTO loginMember = memberService.refresh(token);
		if(loginMember.getMemberName() != null) {
			return ResponseEntity.ok(loginMember);
		}else {
			return ResponseEntity.status(404).build();
		}
	}
	
	//join _ login 
	@PostMapping(value="login") 
	public ResponseEntity<LoginMemberDTO> login(@RequestBody MemberDTO member){
		//System.out.println("m"+member);
		LoginMemberDTO loginMember = memberService.login(member);
		if(loginMember != null) {
			return ResponseEntity.ok(loginMember);
		}else {
			return ResponseEntity.status(404).build();
		}
	}
	
	@GetMapping
	public ResponseEntity<MemberDTO> selectOneMember(@RequestHeader("Authorization") String token){

		MemberDTO member = memberService.selectOneMember(token);
		return ResponseEntity.ok(member);
	}
	
	//아이디 찾기 
	@PostMapping(value = "find-id")
	public ResponseEntity<Object> searchId(@RequestBody MemberDTO member) {
	    MemberDTO searchMember = memberService.searchId(member);
	    if (searchMember != null) {
	        return ResponseEntity.ok(searchMember);
	    } else {
	        Map<String, String> errorResponse = new HashMap<>();
	        errorResponse.put("error", "Not Found");
	        errorResponse.put("message", "가입된 회원이 없습니다.");
	        return ResponseEntity.status(404).body(errorResponse);
	    }
	}
	
	//비밀번 찾기 
	@PostMapping(value = "find-pw")
	public ResponseEntity<Object> searchPw(@RequestBody MemberDTO member) {
	    MemberDTO searchMember = memberService.searchId(member);
	   // if (searchMember != null) {
	        return ResponseEntity.ok(searchMember);
//	    } else {
//	        Map<String, String> errorResponse = new HashMap<>();
//	        errorResponse.put("error", "Not Found");
//	        errorResponse.put("message", "가입된 회원이 없습니다.");
//	        return ResponseEntity.status(404).body(errorResponse);
//	    }
	}
}

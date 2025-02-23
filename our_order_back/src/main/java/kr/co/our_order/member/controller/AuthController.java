package kr.co.our_order.member.controller;

import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import kr.co.our_order.member.model.dto.NaverLoginDTO;
import kr.co.our_order.member.model.service.MemberService;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/auth")
public class AuthController {
	@Autowired
	MemberService memberService;
	
	//Naver Login
    //@PostMapping(value = "naverlogin")
    //public ResponseEntity<Map<String, Object>> naverlogin(@RequestBody NaverLoginDTO naverLogin) {
    //    return memberService.processNaverLogin(naverLogin);  // 서비스 메서드 호출
   // }


    @GetMapping(value = "naverRefresh")
    public ResponseEntity<String> getRefreshToken(@RequestParam String refreshToken) {
    System.out.println(11);
    	return memberService.getRefreshToken(refreshToken);
    }
    
    private final String CLIENT_ID = "3qw7RTkWMzW4O0Rx8tEH";
    private final String CLIENT_SECRET = "rc0w64ahwl";
    private final String REDIRECT_URI = "http://localhost:9999/naver/callback"; // 백엔드 URL

    @GetMapping("/callback")
    public ResponseEntity<Void> naverLoginCallback(@RequestParam String code, @RequestParam String state) {
        //  네이버에서 access token 요청
        Map<String, Object> tokenInfo = getNaverAccessToken(code, state);
        System.out.println(tokenInfo);
        // access token으로 사용자 정보 요청
        String accessToken = (String) tokenInfo.get("access_token");
        Map<String, Object> userInfo = getNaverUserInfo(accessToken);
        System.out.println(userInfo);

        // 사용자 정보 저장 (필요 시 DB 저장)
        //memberService.saveOrUpdateUser(userInfo);

        // 프론트엔드로 리다이렉트 (유저 ID 전달)
        String frontendUrl = "http://localhost:3000/member/info";
        return ResponseEntity.status(HttpStatus.FOUND)  
                .header(HttpHeaders.LOCATION, frontendUrl + "?id=" + userInfo.get("id"))
                .build();
    }

    //  1. 네이버에서 Access Token 요청
    private Map<String, Object> getNaverAccessToken(String code, String state) {
        String tokenUrl = "https://nid.naver.com/oauth2.0/token"
                + "?grant_type=authorization_code"
                + "&client_id=" + CLIENT_ID
                + "&client_secret=" + CLIENT_SECRET
                + "&code=" + code
                + "&state=" + state;

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.getForEntity(tokenUrl, Map.class);
        
        if (response.getBody() != null && response.getBody().containsKey("access_token")) {
            return response.getBody();
        } else {
            throw new RuntimeException("네이버 로그인 실패: access token을 가져올 수 없음");
        }
    }

    // 2. Access Token으로 사용자 정보 요청
    private Map<String, Object> getNaverUserInfo(String accessToken) {
        String userInfoUrl = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, entity, Map.class);
 
        if (response.getBody() != null && response.getBody().containsKey("response")) {
            return (Map<String, Object>) response.getBody().get("response");
        } else {
            throw new RuntimeException("네이버 로그인 실패: 사용자 정보를 가져올 수 없음");
        }
    }

}

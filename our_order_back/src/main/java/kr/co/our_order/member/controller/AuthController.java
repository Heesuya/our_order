package kr.co.our_order.member.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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

import kr.co.our_order.member.model.dto.MemberDTO;
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
        try {
            // 1. 네이버에서 access token과 refresh token 요청
            Map<String, Object> tokenInfo = getNaverAccessToken(code, state);
            String accessToken = (String) tokenInfo.get("access_token");
            String refreshToken = (String) tokenInfo.get("refresh_token");
            //System.out.println(accessToken); 
            
            // 2. access token 으로 사용자 정보가져오기 
            Map<String, Object> userInfo = getNaverUserInfo(accessToken);
            //System.out.println(userInfo); 

            // 3. 사용자 정보 업데이트
            MemberDTO naverUser = memberService.updateUser(userInfo);
            //System.out.println("naverUser : "+naverUser);
            if (naverUser != null) {
                //  Refresh Token을 httpOnly Cookie에 저장
                ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)  // JavaScript에서 접근 불가 (XSS 방어)
                    .secure(true)    // HTTPS에서만 전송
                    .sameSite("Strict")  // CSRF 방어
                    .path("/")       // 전체 도메인에서 유효
                    //.maxAge(Duration.ofDays(7))  // 7일 동안 유지
                    .build();

                // 로그인 성공 시 프론트엔드로 이동
                String frontendUrl = "http://localhost:3000/member/callback";
                String encodedMessage = URLEncoder.encode("로그인 성공", StandardCharsets.UTF_8);
                String encodedMemberNo = URLEncoder.encode(String.valueOf(naverUser.getMemberNo()), StandardCharsets.UTF_8);

                return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, frontendUrl + "?status=success&message="+encodedMessage+"&accessToken=" +accessToken+"&memberNo="+encodedMemberNo)
                    .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString()) // Refresh Token 저장
                    .build();
            } else {
                // 로그인 실패 시 프론트엔드로 이동 (실패 메시지 전달)
                String frontendUrl = "http://localhost:3000/member/callback";
                return ResponseEntity.status(HttpStatus.FOUND)
                    .header(HttpHeaders.LOCATION, frontendUrl + "?status=error")
                    .build();
            }
        } catch (Exception e) {
            // 예외 발생 시 프론트엔드로 이동 (실패 메시지 전달)
            String frontendUrl = "http://localhost:3000/member/callback";
            return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, frontendUrl + "?status=error")
                .build();
        }
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

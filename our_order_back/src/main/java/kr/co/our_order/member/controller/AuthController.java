package kr.co.our_order.member.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;


import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import kr.co.our_order.member.model.dto.MemberDTO;
import kr.co.our_order.member.model.dto.NaverLoginDTO;
import kr.co.our_order.member.model.service.MemberService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping(value="/auth")
public class AuthController {
	@Autowired
	MemberService memberService;
	
	//Naver Login
    //@PostMapping(value = "naverlogin")
    //public ResponseEntity<Map<String, Object>> naverlogin(@RequestBody NaverLoginDTO naverLogin) {
    //    return memberService.processNaverLogin(naverLogin);  // 서비스 메서드 호출
   // }
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
                    .maxAge(Duration.ofDays(1))  // 7일 동안 유지
                    .build();

                // 로그인 성공 시 프론트엔드로 이동
                String frontendUrl = "http://localhost:3000/member/callback";
                String encodedMessage = URLEncoder.encode("로그인 성공", StandardCharsets.UTF_8);
                String encodedMemberNo = URLEncoder.encode(String.valueOf(naverUser.getMemberNo()), StandardCharsets.UTF_8);
                String encodedMemberName = URLEncoder.encode(String.valueOf(naverUser.getMemberName()), StandardCharsets.UTF_8);
                String encodedMemberLevel = URLEncoder.encode(String.valueOf(naverUser.getMemberLevel()), StandardCharsets.UTF_8);
                String encodedAccessToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
                String redirectUrl = frontendUrl + 
                					"?status=success&message=" + encodedMessage + 
                					"&accessToken=" + encodedAccessToken +
                					"&memberNo=" + encodedMemberNo + 
                					"&memberName=" + encodedMemberName + 
                					"&memberLevel" + encodedMemberLevel;
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
    
    @PostMapping(value = "/naverRefresh")
    public ResponseEntity<MemberDTO> getNewToken(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        // refreshToken이 없는 경우 예외 처리
    	System.out.println("refreshToken : "+refreshToken);
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 네이버 API로 새로운 토큰 요청
        String url = "https://nid.naver.com/oauth2.0/token" +
                     "?grant_type=refresh_token&client_id=" + CLIENT_ID +
                     "&client_secret=" + CLIENT_SECRET +
                     "&refresh_token=" + refreshToken;

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

        if (response.getBody() != null && response.getBody().containsKey("access_token")) {
            System.out.println(response.getBody());
            String accessToken = (String) response.getBody().get("access_token");
            String newRefreshToken = (String) response.getBody().get("refresh_token");

            // 새 refreshToken이 있다면 쿠키 업데이트
            HttpHeaders headers = new HttpHeaders();
            if (newRefreshToken != null) {
                ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", newRefreshToken)
                    .httpOnly(true)  // JavaScript에서 접근 불가
                    .secure(true)    // HTTPS에서만 전송
                    .sameSite("Strict")  // CSRF 방어
                    .path("/")       // 전체 도메인에서 유효
                    .maxAge(Duration.ofDays(1))  // 1일 동안 유지
                    .build();
                
        		Map<String, Object> userInfo = getNaverUserInfo(response.getBody().get("access_token").toString());
                MemberDTO member = memberService.getMember(userInfo.get("mobile").toString());
                headers.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
                return ResponseEntity.ok().headers(headers).body(member);
            }else{
    			return ResponseEntity.status(500).build();
            }

        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
	@GetMapping
	public ResponseEntity<MemberDTO> selectOneMember(@RequestHeader("Authorization") String token){
        System.out.println("token : "+token);  //공백 -> +로 대체 
	    String fixedToken = token.replaceAll(" ","+");
		Map<String, Object> userInfo = getNaverUserInfo(fixedToken);
        //네이버에서 발급받은 provideId 로 하면 데이터베이스에서 가져오지 못하는걸까 ㅠ? 
        MemberDTO member = memberService.getMember(userInfo.get("mobile").toString());
		return ResponseEntity.ok(member);
	}

	@DeleteMapping
	public ResponseEntity<Void> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken) {

	    // 로그아웃 시 Refresh Token 쿠키 삭제
	    ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
	            .httpOnly(true)
	            .secure(true)
	            .sameSite("Strict")
	            .path("/")
	            .maxAge(0)  // 쿠키 즉시 삭제
	            .build();

	    return ResponseEntity.ok()
	            .header(HttpHeaders.SET_COOKIE, deleteCookie.toString()) // 쿠키 삭제
	            .build();
	}

}

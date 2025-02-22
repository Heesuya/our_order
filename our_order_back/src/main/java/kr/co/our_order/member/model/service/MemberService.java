package kr.co.our_order.member.model.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.our_order.member.model.dao.MemberDao;
import kr.co.our_order.member.model.dto.LoginMemberDTO;
import kr.co.our_order.member.model.dto.MemberDTO;
import kr.co.our_order.member.model.dto.NaverLoginDTO;
import kr.co.our_order.util.JwtUtils;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;
	@Autowired
	private BCryptPasswordEncoder encoder;
	@Autowired
	private JwtUtils jwtUtil;

	public int checkId(String memberId) {
		int result = memberDao.checkId(memberId);
		return result;
	}

	public int checkEmail(String memberEmail) {
		int result = memberDao.checkEmail(memberEmail);
		return result;
	}

	public int insertMember(MemberDTO member) {
		String encPw = encoder.encode(member.getMemberPw());
		member.setMemberPw(encPw);
		int result = memberDao.insertMember(member);
		return result;
	}

	//일반 회원 리프레시 토큰 
	public LoginMemberDTO refresh(String token) {
		try {
			LoginMemberDTO loginMember = jwtUtil.checkToken(token);
			String accessToken = jwtUtil.createAccessToken(loginMember.getMemberId(), loginMember.getMemberType());
			String refreshToken = jwtUtil.createRefreshToken(loginMember.getMemberId(), loginMember.getMemberType());
			loginMember.setAccessToken(accessToken);
			loginMember.setRefreshToken(refreshToken);
			return loginMember;
		} catch (Exception e) {
			// TODO: handle exception
		}
		return null;
	}

	public LoginMemberDTO login(MemberDTO member) {
		//암호화된 비밀번호를 풀 수가 없어서 아이디만 먼저 조회 후 정보 가져오기.
		MemberDTO m = memberDao.selectOneMember(member.getMemberId());
		//입력한 비밀번호와 m의 암호화된 비밀번호 대조 (순서 맞아야 함)
		if(m != null && encoder.matches(member.getMemberPw(), m.getMemberPw())){
			String accessToken = jwtUtil.createAccessToken(m.getMemberId(), m.getMemberLevel());
			String refeshToken = jwtUtil.createRefreshToken(m.getMemberId(), m.getMemberLevel());
			//System.out.println(accessToken);
			//System.out.println(refeshToken);
			LoginMemberDTO loginMember = new LoginMemberDTO(accessToken, refeshToken, m.getMemberId(), m.getMemberLevel());
			return loginMember;
		}
		return null;//return m  이 되면 아이디 객체가 가기 때문에 null로 리턴 될 수 있게 코드 수정
	}
	
	//naverLogin
	public ResponseEntity<Map<String, Object>> processNaverLogin(NaverLoginDTO naverLogin) {
        Map<String, Object> result = new HashMap<>();
        String apiUrl = "https://openapi.naver.com/v1/nid/me";
        String header = "Bearer " + naverLogin.getAccessToken();

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("Authorization", header);
        String response = get(apiUrl, requestHeaders);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response);
            //System.out.println(root);  // 루트 확인
            
            //api 연결 후 응답에 따라 
            if (root.get("resultcode").asText().equals("00")) {
                JsonNode userInfo = root.get("response");
                String providerId = userInfo.get("id").asText();
                String email = userInfo.get("email").asText();
                String name = userInfo.get("name").asText();
                String mobile = userInfo.get("mobile").asText();              
                
                //회원 조회   Q.providerId 로 조회할 경우 맵퍼에서 왜 안뜨지 ㅠ?  null 로 조회가 됨
                MemberDTO findMember = memberDao.findByNaverId(mobile);
                //System.out.println("조회된 유저: " + findMember);
                //DB 저장 되어있을 경우 
                if (findMember.getProviderId() != null) {
                    result.put("status", "success");
                    result.put("message", "로그인 성공");
                    result.put("userId", findMember.getProviderId());
                    return ResponseEntity.ok(result);
                } else {
                	// DB 안된 경우 DB 저장  ( 이 경우 처음 네이버 가입한 회원이다) 
                    MemberDTO newUser = new MemberDTO();
                    newUser.setProviderId(providerId);
                    newUser.setMemberEmail(email);
                    newUser.setMemberName(name);
                    newUser.setMemberPhone(mobile);
                    System.out.println(newUser);
                    int loginResult = memberDao.insertNaverLogin(newUser);
                    System.out.println("loginResult : "+loginResult);
                    if (loginResult > 0) {
                        result.put("status", "success");
                        result.put("message", "회원가입 후 로그인 성공");
                        result.put("userId", newUser.getMemberId());
                        return ResponseEntity.ok(result);
                    } else {
                        result.put("status", "error");
                        result.put("message", "서버 오류");
                        return ResponseEntity.status(500).body(result);
                    }
                }
            } else {
                result.put("status", "fail");
                result.put("error_code", root.get("resultcode").asText());
                result.put("message", root.get("message").asText());
                return ResponseEntity.status(400).body(result);
            }
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "로그인 처리 중 오류가 발생했습니다.");
            result.put("details", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    private static String get(String apiUrl, Map<String, String> requestHeaders) {
        HttpURLConnection con = connect(apiUrl);
        try {
            con.setRequestMethod("GET");
            for (Map.Entry<String, String> header : requestHeaders.entrySet()) {
                con.setRequestProperty(header.getKey(), header.getValue());
            }
            
            int responseCode = con.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                return readBody(con.getInputStream());
            } else {
                return readBody(con.getErrorStream());
            }
        } catch (Exception e) {
            throw new RuntimeException("API 요청과 응답 실패", e);
        } finally {
            con.disconnect();
        }
    }

    private static HttpURLConnection connect(String apiUrl) {
        try {
            URL url = new URL(apiUrl);
            return (HttpURLConnection) url.openConnection();
        } catch (Exception e) {
            throw new RuntimeException("연결이 실패했습니다.", e);
        }
    }

    private static String readBody(InputStream body) {
        InputStreamReader streamReader = new InputStreamReader(body);
        try (BufferedReader lineReader = new BufferedReader(streamReader)) {
            StringBuilder responseBody = new StringBuilder();
            String line;
            while ((line = lineReader.readLine()) != null) {
                responseBody.append(line);
            }
            return responseBody.toString();
        } catch (Exception e) {
            throw new RuntimeException("API 응답을 읽는데 실패했습니다.", e);
        }
    }
}

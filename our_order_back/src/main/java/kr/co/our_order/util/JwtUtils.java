package kr.co.our_order.util;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import kr.co.our_order.member.model.dto.LoginMemberDTO;

@Component
public class JwtUtils {
	@Value("${jwt.secret-key}") //lombok꺼 아님    필요한 값 등록한 애플리케이션에 있는 값 가져오기, 따로 빼놓고 읽어오는 방식
	public String secretKey;
	@Value("${jwt.expire-hour}")
	public int expireHour;
	@Value("${jwt.expire-hour-refresh}")
	public int expireHourRefresh;
	
	
	//1시간짜리 토큰생성
	public String createAccessToken(int memberNo, int memberType, String memberName) {
		//1. 작성해둔 키값을 이용해서 암호화 코드 생성
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());//시크릿키 읽어와서 내부에서 쓸 방식으로 변환하는것
		//2. 토큰 생성시간 및 만료시간 설정
		Calendar c = Calendar.getInstance();//현재시간으로 먼저 만든다.
		Date startTime = c.getTime();
		c.add(Calendar.HOUR, expireHour);
		//c.add(Calendar.SECOND, 30); //1년짜리 토큰이 있기에 로그인이 안풀린다
		Date expireTime = c.getTime();
		String token = Jwts.builder()                   //JWT생성 시작
						.issuedAt(startTime)			//토큰발행 시작시간
						.expiration(expireTime)         //토큰만료 시간           일정시간동안만 쓸수 있게 세탕
						.signWith(key)                  //암호화 서명
						.claim("memberNo", memberNo)    //토큰에 포함할 회원 정보 세팅(key = value)
						.claim("memberType", memberType)//토큰에 포함할 회원 정보 세팅(key = value)
						.claim("memberName", memberName)// 
						.compact();						//생성
		return token;
	}
	//로그인 유지하게 되는게 목적이기에 refresh token 발급
	//8760시간(1년)짜리 accessToken
	public String createRefreshToken(int memberNo, int memberType, String memberName) {
		//1. 작성해둔 키값을 이용해서 암호화 코드 생성
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());//시크릿키 읽어와서 내부에서 쓸 방식으로 변환하는것
		//2. 토큰 생성시간 및 만료시간 설정
		Calendar c = Calendar.getInstance();//현재시간으로 먼저 만든다.
		Date startTime = c.getTime();
		c.add(Calendar.HOUR, expireHourRefresh);
		Date expireTime = c.getTime();
		String token = Jwts.builder()                   //JWT생성 시작
						.issuedAt(startTime)			//토큰발행 시작시간
						.expiration(expireTime)         //토큰만료 시간           일정시간동안만 쓸수 있게 세탕
						.signWith(key)                  //암호화 서명
						.claim("memberNo", memberNo)    //토큰에 포함할 회원 정보 세팅(key = value)
						.claim("memberType", memberType)//토큰에 포함할 회원 정보 세팅(key = value)
						.claim("memberName", memberName)// 
						.compact();						//생성
		return token;
	}
	
	//토큰을 받아서 확인 
	public LoginMemberDTO checkToken(String token) {
		//1. 토큰 해석을 위한 암호화 생성
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		Claims claims = (Claims) Jwts.parser()			//토큰해석 시작
									.verifyWith(key)	//암호화키
									.build()
									.parse(token)
									.getPayload();
		int memberNo = (int)claims.get("memberNo");
		int memberType =(int)claims.get("memberType");
		String memberName = (String)claims.get("memberName");
		//System.out.println(memberId);
		//System.out.println(memberType);
		LoginMemberDTO loginMemberDTO = new LoginMemberDTO();
		loginMemberDTO.setMemberNo(memberNo);
		loginMemberDTO.setMemberType(memberType);
		loginMemberDTO.setMemberName(memberName);
		return loginMemberDTO;
	}
	

}

package kr.co.our_order.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.co.our_order.member.model.dao.MemberDao;
import kr.co.our_order.member.model.dto.LoginMemberDTO;
import kr.co.our_order.member.model.dto.MemberDTO;
import kr.co.our_order.seller.model.dao.SellerDao;
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
}

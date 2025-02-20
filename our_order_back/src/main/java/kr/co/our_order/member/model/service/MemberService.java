package kr.co.our_order.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.co.our_order.member.model.dao.MemberDao;
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

}

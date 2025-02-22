package kr.co.our_order.member.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.our_order.member.model.dto.MemberDTO;

@Mapper
public interface MemberDao {

	int checkId(String memberId);

	int checkEmail(String memberEmail);

	int insertMember(MemberDTO member);

	MemberDTO selectOneMember(String memberId);

	int insertNaverLogin(MemberDTO newUser);

	MemberDTO findByNaverId(String mobile);


}

package kr.co.our_order.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginMemberDTO {
	private String accessToken;
	private String refreshToken;
	private String memberId;
	private int memberType;
}

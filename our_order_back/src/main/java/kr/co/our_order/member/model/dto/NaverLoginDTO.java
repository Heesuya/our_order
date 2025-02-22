package kr.co.our_order.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class NaverLoginDTO {
	private String accessToken;
    private String state;
    private String tokenType;
    private String expiresIn;
}

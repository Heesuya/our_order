package kr.co.our_order.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class NaverLoginDTO {
	  private String authorizationCode;  // Authorization Code
	  private String accessToken;        // Access Token
	  private String refreshToken;       // Refresh Token
	  private String tokenType;          // Token Type
	  private Long expiresIn;            // Expiration tim
	  private String state;
}

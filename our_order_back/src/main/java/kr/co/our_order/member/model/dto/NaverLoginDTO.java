package kr.co.our_order.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class NaverLoginDTO {
	  private String authorizationCode;  
	  private String accessToken;        
	  private String refreshToken;       
	  private String tokenType;        
	  private Long expiresIn;            
	  private String state;
}

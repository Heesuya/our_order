package kr.co.our_order.member.model.dto;

import org.apache.ibatis.type.Alias;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value = "member")
@Schema(description = "회원 정보")
public class MemberDTO {
    @Schema(description = "회원 번호", type = "int")
    private int memberNo;

    @Schema(description = "아이디", type = "String")
    private String memberId;

    @Schema(description = "비밀번호", type = "String")
    private String memberPw;

    @Schema(description = "이름", type = "String")
    private String memberName;

    @Schema(description = "전화번호", type = "String")
    private String memberPhone;

    @Schema(description = "주소", type = "String")
    private String memberAddr;

    @Schema(description = "사업자번호", type = "String")
    private String businessNumber;

    @Schema(description = "회원 등급 (1: 관리자, 2: 회원, 3: 탈퇴회원)", type = "int")
    private int memberLevel;

    @Schema(description = "가입일 (YYYY-MM-DD)", type = "String")
    private String enrollDate;

    @Schema(description = "탈퇴일 (YYYY-MM-DD)", type = "String", nullable = true)
    private String delDate;

    @Schema(description = "소셜 로그인 제공자 (naver, kakao 등)", type = "String", nullable = true)
    private String provider;

    @Schema(description = "소셜 로그인 제공자 ID", type = "String", nullable = true)
    private String providerId;

    @Schema(description = "회원 이메일", type = "String", nullable = true)
    private String memberEmail;
    
	private String accessToken;        
	private String refreshToken;       
}

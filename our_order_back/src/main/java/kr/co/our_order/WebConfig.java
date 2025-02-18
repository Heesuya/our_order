package kr.co.our_order;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class WebConfig implements WebMvcConfigurer{
	@Value("${file.root}")
	private String root;
	
	@Bean
	public BCryptPasswordEncoder  bcrypt() {
		return new BCryptPasswordEncoder();
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/**").addResourceLocations("classpath:/templates/","classpath:/static/");
		
		// 판매자 가게 이미
		registry.addResourceHandler("/seller/sellerStore/*")
				.addResourceLocations("file:///"+root+"/seller/sellerStore/");
		
		// 음식 이미지 
		registry.addResourceHandler("/seller/menu/*")
				.addResourceLocations("file:///"+root+"/seller/menu/");
	}
	
}

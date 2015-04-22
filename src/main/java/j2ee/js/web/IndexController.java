package j2ee.js.web;


import j2ee.js.service.IndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;



/**  
 * @author yuanwei  
 * @version ctreateTime:2011-8-22 下午5:25:28
 *   
 */
@Controller
public class IndexController {
	@Autowired
	@Value("#{application['application.test']}")
	private String name;
	@Resource(name="indexService")
	private IndexService indexService;


	@RequestMapping("/index")
	@ResponseBody
	public String index(){
		System.out.println("name:"+name);
		System.out.println("indexService:"+indexService.getName());
		return "Hello World";
	}
}

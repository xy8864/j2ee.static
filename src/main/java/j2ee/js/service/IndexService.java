package j2ee.js.service;


/**  
 * @author yuanwei  
 * @version ctreateTime:2011-8-23 上午9:39:34
 *   
 */
//@Service("indexService")
public class IndexService {
	//@Value("${application.test}")
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name=name;
	}
	
}

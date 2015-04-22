package j2ee.js.web;

import j2ee.js.utils.RequestUtil;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

/**
 * @author yuanwei
 * @version ctreateTime:2011-8-16 下午5:53:28
 */
@Controller
public class AjaxFileuploadController {

	@SuppressWarnings({ "deprecation", "unchecked" })
	@RequestMapping("/ajaxUpload.do")
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		RequestUtil.debugParam(request);
		String savePath="D:/Server/IDE/eclipseWork/j2ee.mvn/modules/j2ee.js/src/main/webapp/images/upload/";
		File f1=new File(savePath);
		System.out.println(savePath);
		if(!f1.exists()){
			f1.mkdirs();
		}
		DiskFileItemFactory fac=new DiskFileItemFactory();
		ServletFileUpload upload=new ServletFileUpload(fac);
		upload.setHeaderEncoding("utf-8");
		List<FileItem> fileList=null;
		try{
			fileList=upload.parseRequest(request);
		}catch(FileUploadException ex){
			ex.printStackTrace();
		}
		Iterator<FileItem> it=fileList.iterator();
		String name="";
		String extName="";
		while(it.hasNext()){
			FileItem item=it.next();
			if(!item.isFormField()){
				name=item.getName();
				long size=item.getSize();
				String type=item.getContentType();
				System.out.println(size + " " + type);
				if(name == null || name.trim().equals("")){
					continue;
				}
				// 扩展名格式：
				if(name.lastIndexOf(".") >= 0){
					extName=name.substring(name.lastIndexOf("."));
				}
				File file=null;
				do{
					// 生成文件名：
					name=UUID.randomUUID().toString();
					file=new File(savePath + name + extName);
				}while(file.exists());
				File saveFile=new File(savePath + name + extName);
				try{
					item.write(saveFile);
				}catch(Exception e){
					e.printStackTrace();
				}
			}
		}
		response.getWriter().print(name + extName);
		return null;
	}
}

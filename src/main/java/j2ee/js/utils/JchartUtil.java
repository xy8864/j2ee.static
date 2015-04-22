package j2ee.js.utils;

import org.jfree.chart.ChartUtilities;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.CategoryAxis;
import org.jfree.chart.axis.ValueAxis;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PiePlot;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.title.TextTitle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.io.OutputStream;

/**
 * @author yuanwei
 * @version ctreateTime:2012-8-8 下午4:02:58
 */
public class JchartUtil {
	private static Logger	log	=LoggerFactory.getLogger(JchartUtil.class);
	public static enum Type{
		LINE,
		CYLINDER,
		/** 饼状图 */
		PIE
	}
	
	public static void response(HttpServletResponse response, JFreeChart chart, int width, int height,Type type) {
		resolveCoding(chart,type);
		OutputStream out=null;
		try{
			out=response.getOutputStream();
			ChartUtilities.writeChartAsPNG(out,chart,700,400);
		}catch(IOException e){
			log.error("write IOException",e);
		}finally{
			if(out != null) try{
				out.close();
			}catch(IOException e){
				log.error("out.close():",e);
			}
		}
	}
	
	public static void resolveCoding(JFreeChart chart,Type type) {
		TextTitle textTitle=chart.getTitle();
		textTitle.setFont(new Font("黑体",Font.PLAIN,20));

		Font defaultFont=new Font("黑体",Font.PLAIN,12);
		switch(type){
		case LINE:{
			XYPlot xyPlot=(XYPlot)chart.getPlot();
			ValueAxis domainAxis=xyPlot.getDomainAxis();
			domainAxis.setVisible(true);
			xyPlot.setDomainAxis(domainAxis);
			ValueAxis rAxis=xyPlot.getRangeAxis();
			/*------设置X轴坐标上的文字-----------*/
			domainAxis.setTickLabelFont(defaultFont);
			/*------设置X轴的标题文字------------*/
			domainAxis.setLabelFont(defaultFont);
			/*------设置Y轴坐标上的文字-----------*/
			rAxis.setTickLabelFont(defaultFont);
			/*------设置Y轴的标题文字------------*/
			rAxis.setLabelFont(defaultFont);
			break;
		}case CYLINDER:{
			//Plot plot=chart.getPlot();
			// 图例和其它乱码一样处理，更换字体。
			CategoryPlot categoryPlot=chart.getCategoryPlot(); // 获得图表区域对象
			CategoryAxis domainAxis=categoryPlot.getDomainAxis();
			domainAxis.setVisible(true);
			categoryPlot.setDomainAxis(domainAxis);
			ValueAxis rAxis=categoryPlot.getRangeAxis();
			/*------设置X轴坐标上的文字-----------*/
			domainAxis.setTickLabelFont(defaultFont);
			/*------设置X轴的标题文字------------*/
			domainAxis.setLabelFont(defaultFont);
			/*------设置Y轴坐标上的文字-----------*/
			rAxis.setTickLabelFont(defaultFont);
			/*------设置Y轴的标题文字------------*/
			rAxis.setLabelFont(defaultFont);
			break;
		}case PIE:{
			PiePlot pieplot = (PiePlot)chart.getPlot();
			pieplot.setLabelFont(defaultFont);
			break;
		}default:
			break;
		}
		/*------这句代码解决了底部汉字乱码的问题-----------*/
		chart.getLegend().setItemFont(defaultFont);
	}
}

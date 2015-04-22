package j2ee.js.web;

import j2ee.js.utils.JchartUtil;
import j2ee.js.utils.JchartUtil.Type;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.DateAxis;
import org.jfree.chart.axis.ValueAxis;
import org.jfree.chart.labels.*;
import org.jfree.chart.plot.PiePlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.category.BarRenderer3D;
import org.jfree.chart.renderer.xy.XYItemRenderer;
import org.jfree.chart.renderer.xy.XYLineAndShapeRenderer;
import org.jfree.data.category.CategoryDataset;
import org.jfree.data.general.DatasetUtilities;
import org.jfree.data.general.DefaultPieDataset;
import org.jfree.data.time.Month;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;
import org.jfree.ui.TextAnchor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import utils.RequestUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;

/**
 * @author yuanwei
 * @version ctreateTime:2012-8-8 下午3:31:54
 */
@Controller("/chart")
public class JchartController {
	/**
	 * http://ran/static/cylinder.do
	 * <br/>@RequestMapping("/cylinder")对应[/pie] [/pie.*]
	 * <br/>@RequestMapping("/cylinder.do")对应[/cylinder.do] 
	 * @param request
	 * @param response
	 */
	@RequestMapping("cylinder.do")@ResponseBody
	public void cylinder(HttpServletRequest request,HttpServletResponse response) {
		// 模拟数据
		double[][] data={ { 1185, 995, 1286, 1210 }, { 916, 1028, 900, 885 }, { 982, 763, 935, 665 }, { 384, 568, 928, 773 } };
		String[] rowKeys={ "A产品", "B产品", "C产品", "D产品" };
		String[] columKeys={ "E-1区", "E-2区", "E-3区", "E-4区" };
		// 创建Dataset对象
		CategoryDataset dataset=DatasetUtilities.createCategoryDataset(rowKeys,columKeys,data);
		// 创建3D柱状图
		JFreeChart chart=ChartFactory.createBarChart3D("2011年产品销售量","","销量/件",dataset,PlotOrientation.VERTICAL,true,true,false);
		// 设置背景颜色
		chart.setBackgroundPaint(Color.WHITE);
		if(!"simple".equals(RequestUtil.get(request,"action",null))){
			// 创建柱体绘制器对象
			BarRenderer3D renderer=new BarRenderer3D();
			renderer.setBaseItemLabelGenerator(new StandardCategoryItemLabelGenerator());
			// 设置柱体数值可见
			renderer.setBaseItemLabelsVisible(true);
			// 调整数值显示位置
			renderer.setBasePositiveItemLabelPosition(new ItemLabelPosition(ItemLabelAnchor.OUTSIDE12,TextAnchor.BASELINE_LEFT));
			renderer.setItemLabelAnchorOffset(10D);
			chart.getCategoryPlot().setRenderer(renderer);
		}
		JchartUtil.response(response,chart,700,400,Type.CYLINDER);
	}

	@RequestMapping("/line")@ResponseBody
	public void line(HttpServletRequest request,HttpServletResponse response) {
		@SuppressWarnings("deprecation")
		TimeSeries series2010 = new TimeSeries("2010年度", Month.class);
		@SuppressWarnings("deprecation")
		TimeSeries series2011 = new TimeSeries("2011年度", Month.class);
		TimeSeriesCollection dataset = new TimeSeriesCollection();
		series2010.add(new Month(1, 2011), 36);series2010.add(new Month(2, 2011), 84);series2010.add(new Month(3, 2011), 202);
		series2010.add(new Month(4, 2011), 183);series2010.add(new Month(5, 2011), 172);series2010.add(new Month(6, 2011), 107);
		series2010.add(new Month(7, 2011), 200);series2010.add(new Month(8, 2011), 87);	series2010.add(new Month(9, 2011), 250);
		series2010.add(new Month(10, 2011), 152);series2010.add(new Month(11, 2011), 235);series2010.add(new Month(12, 2011), 266);
		series2011.add(new Month(1, 2011), 156);series2011.add(new Month(2, 2011), 216);series2011.add(new Month(3, 2011), 118);
		series2011.add(new Month(4, 2011), 250);series2011.add(new Month(5, 2011), 257);series2011.add(new Month(6, 2011), 253);
		series2011.add(new Month(7, 2011), 355);series2011.add(new Month(8, 2011), 300);series2011.add(new Month(9, 2011), 103);
		series2011.add(new Month(10, 2011), 250);series2011.add(new Month(11, 2011), 348);series2011.add(new Month(12, 2011), 325);

		dataset.addSeries(series2010);dataset.addSeries(series2011);
		JFreeChart chart = ChartFactory.createTimeSeriesChart("A产品销售量", "", "", dataset, true, true, false);
		DateAxis dateaxis = (DateAxis)chart.getXYPlot().getDomainAxis();
		dateaxis.setDateFormatOverride(new SimpleDateFormat("MM月"));
		chart.setBackgroundPaint(Color.WHITE);
		if(!"simple".equals(RequestUtil.get(request,"action",null))){
			XYPlot plot = (XYPlot)chart.getPlot();
			XYLineAndShapeRenderer xylineandshaperenderer = (XYLineAndShapeRenderer)plot.getRenderer();
			//设置曲线是否显示数据点 
			xylineandshaperenderer.setBaseShapesVisible(true);
			//设置曲线显示各数据点的值 
			XYItemRenderer xyitem = plot.getRenderer();
			xyitem.setBaseItemLabelsVisible(true);
			xyitem.setBasePositiveItemLabelPosition(new ItemLabelPosition(ItemLabelAnchor.OUTSIDE12, TextAnchor.BASELINE_LEFT));
			xyitem.setBaseItemLabelGenerator(new StandardXYItemLabelGenerator());
			xyitem.setBaseItemLabelFont(new Font("Dialog", 1, 14));
			plot.setRenderer(xyitem);
			ValueAxis rangeAxis = plot.getRangeAxis();
			//距离上边距边框距离
			rangeAxis.setUpperMargin(0.3);
			//距离下边框边距距离
			rangeAxis.setLowerMargin(0.5);
			ValueAxis domainAxis = plot.getDomainAxis();
			// 左边距 边框距离   
			domainAxis.setLowerMargin(0.05);
			// 右边距 边框距离,防止最后边的一个数据靠近了坐标轴。 
			domainAxis.setUpperMargin(0.1);
		}
		JchartUtil.response(response,chart,700,400,Type.LINE);
	}

	@RequestMapping("/pie")@ResponseBody
	public void pie(HttpServletRequest request,HttpServletResponse response){
		//创建Dataset对象
		DefaultPieDataset dataset = new DefaultPieDataset();
		//模拟数据
		dataset.setValue("E-1区", 50);
		dataset.setValue("E-2区", 150);
		dataset.setValue("E-3区", 80);
		dataset.setValue("E-4区", 140);
		dataset.setValue("E-5区", 180);
		dataset.setValue("E-6区", 130);
		dataset.setValue("E-7区", 100);
		//创建3D饼状图
		JFreeChart chart = ChartFactory.createPieChart3D("2011年A产品销售量", dataset, true, false, false);
		//设置背景颜色
		chart.setBackgroundPaint(Color.WHITE);
		if(!"simple".equals(RequestUtil.get(request,"action",null))){
			PiePlot plot = (PiePlot)chart.getPlot();
			// 图片中显示百分比：自定义方式，{0} 表示选项， {1} 表示数值，{2} 表示所占比例 ，小数点后两位 
			plot.setLabelGenerator(new StandardPieSectionLabelGenerator("{0}={1}({2})", NumberFormat.getNumberInstance(),new DecimalFormat("0.00%")));
		}
		JchartUtil.response(response,chart,700,400,Type.PIE);
	}
}

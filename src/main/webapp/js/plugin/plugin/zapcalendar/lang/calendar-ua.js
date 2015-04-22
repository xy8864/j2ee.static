﻿// $Id: calendar-ua.js,v 1.1 2009/04/25 04:27:56 yinpinghui Exp $
﻿// ** I18N

// Calendar UA language
// Translation: Vasyl Zuzyak, <stk.zuzyak.vv@gmail.com>
// Encoding: any
// Distributed under the same terms as the calendar itself.

// For translators: please use UTF-8 if possible.  We strongly believe that
// Unicode is the answer to a real internationalized world.  Also please
// include your contact information in the header, as can be seen above.

// full day names
Zapatec.Calendar._DN = new Array
("неділя",
 "понеділок",
 "вівторок",
 "середа",
 "четверг",
 "п'ятниця",
 "субота",
 "неділя");

// Please note that the following array of short day names (and the same goes
// for short month names, _SMN) isn't absolutely necessary.  We give it here
// for exemplification on how one can customize the short day names, but if
// they are simply the first N letters of the full name you can simply say:
//
//   Zapatec.Calendar._SDN_len = N; // short day name length
//   Zapatec.Calendar._SMN_len = N; // short month name length
//
// If N = 3 then this is not needed either since we assume a value of 3 if not
// present, to be compatible with translation files that were written before
// this feature.

// short day names
Zapatec.Calendar._SDN = new Array
("нд",
 "пн",
 "вт",
 "ср",
 "чт",
 "пт",
 "сб",
 "нд");

// full month names
Zapatec.Calendar._MN = new Array
("Січень",
 "Лютий",
 "Березень",
 "Квітень",
 "Травень",
 "Червень",
 "Липень",
 "Серпень",
 "Вересень",
 "Жовтень",
 "Листопад",
 "Грудень");

// short month names
Zapatec.Calendar._SMN = new Array
("січ",
 "лют",
 "бер",
 "кві",
 "тра",
 "чер",
 "лип",
 "сер",
 "вер",
 "жов",
 "лис",
 "грд");

// tooltips
Zapatec.Calendar._TT_ua = Zapatec.Calendar._TT = {};
Zapatec.Calendar._TT["INFO"] = "Про календар...";

Zapatec.Calendar._TT["ABOUT"] =
"DHTML Date/Time Selector\n" +
"(c) zapatec.com 2002-2007\n" + // don't translate this this ;-)
"For latest version visit: http://www.zapatec.com\n" +
"This translation distributed under GNU LGPL.  See http://gnu.org/licenses/lgpl.html for details." +
"\n\n" +
"Як вибрати дату:\n" +
"- За допомогою кнопок \xab, \xbb можна вибрати рік\n" +
"- За допомогою кнопок " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " можна вибрати місяць\n" +
"- Утримуйте натиснутими ці кнопки, щоб з'явилося меню швидкого вибору.";
Zapatec.Calendar._TT["ABOUT_TIME"] = "\n\n" +
"Як вибрати час:\n" +
"- При клацанні на годинах чи хвилинах вони збільшуються\n" +
"- при клацанні зі натиснутою клавішою Shift вони зменшуються\n" +
"- якщо нажати і рухати мишкою вліво або вправо, вони будуть змінюватися швидше.";

Zapatec.Calendar._TT["PREV_YEAR"] = "На рік назад (утримувати для меню)";
Zapatec.Calendar._TT["PREV_MONTH"] = "На місяць назад (утримувати для меню)";
Zapatec.Calendar._TT["GO_TODAY"] = "Сьогодні";
Zapatec.Calendar._TT["NEXT_MONTH"] = "На місяць вперед (утримувати для меню)";
Zapatec.Calendar._TT["NEXT_YEAR"] = "На рік вперед (утримувати для меню)";
Zapatec.Calendar._TT["SEL_DATE"] = "Виберіть дату";
Zapatec.Calendar._TT["DRAG_TO_MOVE"] = "Перетягуйте мишкою";
Zapatec.Calendar._TT["PART_TODAY"] = " (сьогодні)";

// the following is to inform that "%s" is to be the first day of week
// %s will be replaced with the day name.
Zapatec.Calendar._TT["DAY_FIRST"] = "Першим днем тижня буде %s";

// This may be locale-dependent.  It specifies the week-end days, as an array
// of comma-separated numbers.  The numbers are from 0 to 6: 0 means Sunday, 1
// means Monday, etc.
Zapatec.Calendar._TT["WEEKEND"] = "0,6";

Zapatec.Calendar._TT["CLOSE"] = "Закрити";
Zapatec.Calendar._TT["TODAY"] = "Сьогодні";
Zapatec.Calendar._TT["TIME_PART"] = "(Shift-)натискання або натиснути і перемістити";

// date formats
Zapatec.Calendar._TT["DEF_DATE_FORMAT"] = "%Y-%m-%d";
Zapatec.Calendar._TT["TT_DATE_FORMAT"] = "%e %b, %a";

Zapatec.Calendar._TT["WK"] = "тжд";
Zapatec.Calendar._TT["TIME"] = "Час:";

/* Preserve data */
	if(Zapatec.Calendar._DN) Zapatec.Calendar._TT._DN = Zapatec.Calendar._DN;
	if(Zapatec.Calendar._SDN) Zapatec.Calendar._TT._SDN = Zapatec.Calendar._SDN;
	if(Zapatec.Calendar._SDN_len) Zapatec.Calendar._TT._SDN_len = Zapatec.Calendar._SDN_len;
	if(Zapatec.Calendar._MN) Zapatec.Calendar._TT._MN = Zapatec.Calendar._MN;
	if(Zapatec.Calendar._SMN) Zapatec.Calendar._TT._SMN = Zapatec.Calendar._SMN;
	if(Zapatec.Calendar._SMN_len) Zapatec.Calendar._TT._SMN_len = Zapatec.Calendar._SMN_len;
	Zapatec.Calendar._DN = Zapatec.Calendar._SDN = Zapatec.Calendar._SDN_len = Zapatec.Calendar._MN = Zapatec.Calendar._SMN = Zapatec.Calendar._SMN_len = null
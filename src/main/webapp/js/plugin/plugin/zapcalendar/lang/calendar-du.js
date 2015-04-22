// $Id: calendar-du.js,v 1.1 2009/04/25 04:27:55 yinpinghui Exp $
// ** I18N

// Calendar EN language
// Author: Mihai Bazon, <mihai_bazon@yahoo.com>
// Translator : Dirk Vos, <dirk.vos-at-trios.be>
// Encoding: any
// Distributed under the same terms as the calendar itself.

// For translators: please use UTF-8 if possible.  We strongly believe that
// Unicode is the answer to a real internationalized world.  Also please
// include your contact information in the header, as can be seen above.

// full day names
Zapatec.Calendar._DN = new Array
("Zondag",
 "Maandag",
 "Dinsdag",
 "Woensdag",
 "Donderdag",
 "Vrijdag",
 "Zaterdag",
 "Zondag");

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
("Zon",
 "Maa",
 "Din",
 "Woe",
 "Don",
 "Vri",
 "Zat",
 "Zon");

// First day of the week. "0" means display Sunday first, "1" means display
// Monday first, etc.
Zapatec.Calendar._FD = 1;

// full month names
Zapatec.Calendar._MN = new Array
("Januari",
 "Februari",
 "Maart",
 "April",
 "Mei",
 "Juni",
 "Juli",
 "Augustus",
 "September",
 "Oktober",
 "November",
 "December");

// short month names
Zapatec.Calendar._SMN = new Array
("Jan",
 "Feb",
 "Maa",
 "Apr",
 "May",
 "Jun",
 "Jul",
 "Aug",
 "Sep",
 "Oct",
 "Nov",
 "Dec");

// tooltips
Zapatec.Calendar._TT_du = Zapatec.Calendar._TT = {};
Zapatec.Calendar._TT["INFO"] = "Over de calendar";

Zapatec.Calendar._TT["ABOUT"] =
"DHTML Date/Time Selector\n" +
"(c) zapatec.com 2002-2007\n" + // don't translate this this ;-)
"Voor de meest recente versie, surf naar : http://www.zapatec.com/\n" +
"\n\n" +
"Datum selectie:\n" +
"- Gebruik the \xab, \xbb knoppen om het jaar te selecteren\n" +
"- Gebruik de " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " knoppen om de maand te selecteren\n" +
"- Houd de muisknop ingedrukt op ��n van de maand- of jaarselectieknoppen, dan kan u een snellere selectie maken.";Zapatec.Calendar._TT["ABOUT_TIME"] = "\n\n" +
"Tijd selectie:\n" +
"- Klik op ��n van de tijdsdelen om de waarde te verhogen\n" +
"- of Shift-klik om te verlagen\n" +
"- of klik en sleep voor een snellere selectie.";

Zapatec.Calendar._TT["PREV_YEAR"] = "Vorig jaar (ingedrukt=menu)";
Zapatec.Calendar._TT["PREV_MONTH"] = "Vorige maand (ingedrukt=menu)";
Zapatec.Calendar._TT["GO_TODAY"] = "Vandaag (ingedrukt=geschiedenis)";
Zapatec.Calendar._TT["NEXT_MONTH"] = "Volgende maand (ingedrukt=menu)";
Zapatec.Calendar._TT["NEXT_YEAR"] = "Volgende jaar (ingedrukt=menu)";
Zapatec.Calendar._TT["SEL_DATE"] = "Kies een datum";
Zapatec.Calendar._TT["DRAG_TO_MOVE"] = "Sleep=verplaatsen";
Zapatec.Calendar._TT["PART_TODAY"] = " (Vandaag)";

// the following is to inform that "%s" is to be the first day of week
// %s will be replaced with the day name.
Zapatec.Calendar._TT["DAY_FIRST"] = "Toon %s als eerste dag";

// This may be locale-dependent.  It specifies the week-end days, as an array
// of comma-separated numbers.  The numbers are from 0 to 6: 0 means Sunday, 1
// means Monday, etc.
Zapatec.Calendar._TT["WEEKEND"] = "0,6";

Zapatec.Calendar._TT["CLOSE"] = "Sluit";
Zapatec.Calendar._TT["TODAY"] = "Vandaag";
Zapatec.Calendar._TT["TIME_PART"] = "(Shift-)Klik of sleep=waarde wijzigen";

// date formats
Zapatec.Calendar._TT["DEF_DATE_FORMAT"] = "%Y-%m-%d";
Zapatec.Calendar._TT["TT_DATE_FORMAT"] = "%a, %b %e";

Zapatec.Calendar._TT["WK"] = "Wk";
Zapatec.Calendar._TT["TIME"] = "Tijd:";

Zapatec.Calendar._TT["E_RANGE"] = "Buiten bereik";

/* Preserve data */
	if(Zapatec.Calendar._DN) Zapatec.Calendar._TT._DN = Zapatec.Calendar._DN;
	if(Zapatec.Calendar._SDN) Zapatec.Calendar._TT._SDN = Zapatec.Calendar._SDN;
	if(Zapatec.Calendar._SDN_len) Zapatec.Calendar._TT._SDN_len = Zapatec.Calendar._SDN_len;
	if(Zapatec.Calendar._MN) Zapatec.Calendar._TT._MN = Zapatec.Calendar._MN;
	if(Zapatec.Calendar._SMN) Zapatec.Calendar._TT._SMN = Zapatec.Calendar._SMN;
	if(Zapatec.Calendar._SMN_len) Zapatec.Calendar._TT._SMN_len = Zapatec.Calendar._SMN_len;
	Zapatec.Calendar._DN = Zapatec.Calendar._SDN = Zapatec.Calendar._SDN_len = Zapatec.Calendar._MN = Zapatec.Calendar._SMN = Zapatec.Calendar._SMN_len = null
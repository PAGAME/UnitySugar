using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using System;
using System.Json;
using System.Linq;

namespace GS {
	class GSTool {
		public static void test_json() {
			// json
			// var css = "{ header : {background:\"red\"}, layout : [5,4,1],color:\"cyan\" }";
			var css = "[ {\"layout\" : [5,4,1], \"color\" : \"cyan\" }, {\"a\": 1} ]";
			var style = JsonArray.Parse(css) as JsonArray;

			// (
			// from s in style
			// where s.Key == "color"
			// select (string)s.Value
			// ).First().ToString();
			// print(style.ToString()); // Linq
			print(style[0]);
			print(style[0]["layout"][0]);
		}

		public static void loadAll() {
			// load all assets from the a folder
			Object[] pictures = Resources.LoadAll("down");
		}
	}

	class GSObject {
		
	}
}